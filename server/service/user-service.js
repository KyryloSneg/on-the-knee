const UserModel = require('../models/user-model');
const UserDeviceModel = require("../models/user-device-model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const UserDeviceDto = require('../dtos/user-device-dto');
const UserAddressModel = require('../models/user-address-model');
const ActivationInfoModel = require('../models/activation-info-model');
const RoleModel = require('../models/role-model');
const ActivationInfoDto = require('../dtos/activation-info-dto');
const UserAddressDto = require('../dtos/user-address-dto');
const { parsePhoneNumber } = require('libphonenumber-js');

class UserService {
    async registration(name, surname, password, email, phoneNumber, ip) {
        const numberObj = parsePhoneNumber(phoneNumber);
        const internationalNumber = numberObj.formatInternational();

        const emailCandidate = await UserAddressModel.findOne({email: email});
        const phoneNumberCandidate = await UserAddressModel.findOne({phoneNumber: internationalNumber});
        if (emailCandidate || phoneNumberCandidate) {
            throw ApiError.BadRequest(`User with such a email ${email} or phone number ${phoneNumber} already exists`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const userRole = await RoleModel.findOne({ value: "PUBLIC" });
        const user = await UserModel.create({ name: name, surname: surname, password: hashPassword, roles: [userRole.value]});

        const userAddress = await UserAddressModel.create({ user: user._id, email: email, phoneNumber: internationalNumber });

        const activationInfo = await ActivationInfoModel.create({ user: user._id, isActivated: false, activationLink: activationLink });

        const hashedIp = await bcrypt.hash(ip, 3);
        const userDevice = await UserDeviceModel.create({ user: user._id, ip: hashedIp });
        const userDeviceDto = new UserDeviceDto(userDevice);
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); // id, name, surname, roles
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDevice._id, tokens.refreshToken);

        const infoDto = new ActivationInfoDto(activationInfo);
        const addressDto = new UserAddressDto(userAddress);

        return {...tokens, user: userDto, address: addressDto, activationInfo: infoDto, device: userDeviceDto};
    }

    async activate(activationLink) {
        const info = await ActivationInfoModel.findOne({activationLink})
        if (!info) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        info.isActivated = true;
        await info.save();
    }

    async login(address, password, ip) {
        const userAddress = await UserAddressModel.findOne({email: address}) 
                     || await UserAddressModel.findOne({phoneNumber: address});
        if (!userAddress) {
            throw ApiError.BadRequest('User with such a email / phone number does not exist');
        }

        const user = await UserModel.findById(userAddress.user);
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password');
        }

        const userDevices = await UserDeviceModel.find({user: user._id});
        let userDevice = null;

        for (let dev of userDevices) {
            if (await bcrypt.compare(ip, dev.ip)) {
                userDevice = {...dev};
                break;
            }
        }

        if (!userDevice) {
            const hashedIp = await bcrypt.hash(ip, 3);
            userDevice = await UserDeviceModel.create({ user: user._id, ip: hashedIp });
        }

        const userDto = new UserDto(user);
        const userDeviceDto = new UserDeviceDto(userDevice);
        const tokens = tokenService.generateTokens({...userDto});

        // we could login without account activation, so give activation info dto to client
        // even after user login
        const activationInfo = await ActivationInfoModel.findOne({ user: user._id }); 
        const activationInfoDto = new ActivationInfoDto(activationInfo);

        if (!activationInfo.isActivated) {
            await mailService.sendActivationMail(
                userAddress.email, `${process.env.API_URL}/api/activate/${activationInfo.activationLink}`
            );
        }

        await tokenService.saveToken(userDevice._doc._id, tokens.refreshToken);
        return {...tokens, user: userDto, activationInfo: activationInfoDto, userDevice: userDeviceDto};
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async createRole(value) {
        const role = await RoleModel.create({value: value});
        return role;
    }

    async addRole(value, userId) {
        // check if there's such a role in the DB
        let role;
        try {
            // if we catch an error in this line we must ignore it
            // idk why it throws a "CastError" if we dont' implement it
            role = await RoleModel.findOne({value: value});
        } catch { }

        if (!role) {
            throw ApiError.BadRequest("Incorrect role");
        }

        let user;
        try {
            user = await UserModel.findById(userId);
        } catch { }

        if (!user) {
            throw ApiError.BadRequest("Incorrect user");
        }

        if (user.roles.includes(value)) {
            throw ApiError.BadRequest("User already has this role");
        }

        user.roles = [...user.roles, value];
        await user.save();

        return user.roles;
    }

    async deleteRole(value, userId) {
        // check if there's such a role in the DB
        let role;
        try {
            role = await RoleModel.findOne({value: value});
        } catch { }

        if (!role) {
            throw ApiError.BadRequest("Incorrect role");
        }

        let user;
        try {
            user = await UserModel.findById(userId);
        } catch { }
        
        if (!user) {
            throw ApiError.BadRequest("Incorrect user");
        }

        user.roles = user.roles.filter(r => r !== value);
        await user.save();

        return value;
    }

    async refresh(refreshToken, ip) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);

        const userDevices = await UserDeviceModel.find({user: user._id});
        let userDevice = null;

        for (let dev of userDevices) { // kolxoz
            if (await bcrypt.compare(ip, dev.ip)) {
                userDevice = {...dev};
                break;
            }
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDevice._doc._id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async changeUserAddress(email, phoneNumber, userId) {
        const address = await UserAddressModel.findOne({user: userId});
        let info = null;

        if (address.email !== email) {
            info = await ActivationInfoModel.findOne({user: userId});
            const activationLink = uuid.v4();

            info.isActivated = false;
            info.activationLink = activationLink;
            await info.save();
        }
        const numberObj = parsePhoneNumber(phoneNumber);
        const internationalNumber = numberObj.formatInternational();

        address.email = email;
        address.phoneNumber = internationalNumber;
        await address.save();

        const addressDto = new UserAddressDto(address);
        const infoDto = info ? new ActivationInfoDto(info) : null;
        return { ...addressDto, activationInfo: infoDto };
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async getUser(id, isDto = false) {
        const user = await UserModel.findOne({_id: id});
        if (isDto) {
            const userDto = user ? new UserDto(user) : null;
            return userDto;
        } else {
            return user;
        }
    }
}

module.exports = new UserService();