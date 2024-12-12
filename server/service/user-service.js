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
const { MAX_USER_DEVICES_AMOUNT } = require("../consts");
const tokenModel = require("../models/token-model");
const EmailToConfirmModel = require("../models/email-to-confirm-model");
const DocumentNotFoundError = require("mongoose/lib/error/notFound");
const EmailToConfirmDto = require("../dtos/email-to-confirm-dto");

class UserService {
    async registration(name, surname, password, email, phoneNumber, ip) {
        const numberObj = parsePhoneNumber(phoneNumber);
        const internationalNumber = numberObj.formatInternational();

        const emailCandidate = await UserAddressModel.findOne({email: email});
        const phoneNumberCandidate = await UserAddressModel.findOne({phoneNumber: internationalNumber});

        if (emailCandidate) {
            throw ApiError.BadRequest(`User with such a email ${email} already exists`);
        }

        if (phoneNumberCandidate) {
            throw ApiError.BadRequest(`User with such a phone number ${phoneNumber} already exists`);
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

    async activate(activationLink, isChangingEmail = false) {
        let info;
        if (isChangingEmail) {
            info = await EmailToConfirmModel.findOne({confirmationLink: activationLink});
        } else {
            info = await ActivationInfoModel.findOne({activationLink});
        }

        if (!info) {
            throw ApiError.BadRequest('Incorrect activation link')
        }

        if (isChangingEmail) {
            info.isConfirmed = true;

            const address = await UserAddressModel.findOne({user: info.user})
            const emailsToConfirm = await EmailToConfirmModel.find({user: info.user});

            if (Array.isArray(emailsToConfirm)) {
                let newEmail;
                let areAllEmailsToConfirmConfirmed = false;

                for (let emailToConfirm of emailsToConfirm) {
                    const otherEmailToConfirm = emailsToConfirm.find(email => email.id !== emailToConfirm.id);
                    
                    if (otherEmailToConfirm.isConfirmed) areAllEmailsToConfirmConfirmed = true;
                    if (emailToConfirm.email !== address.email) newEmail = emailToConfirm.email
                }

                if (areAllEmailsToConfirmConfirmed && newEmail !== address.email) {
                    // changing the address' email
                    address.email = newEmail;
                    await address.save();

                    const activationInfo = await ActivationInfoModel.findOne({user: info.user});
                    if (!activationInfo.isActivated) {
                        activationInfo.isActivated = true;
                        await activationInfo.save();
                    }

                    await EmailToConfirmModel.deleteMany({user: info.user});
                }
            }
        } else {
            info.isActivated = true;
        }

        try {
            // idk why this error is throwed even if everything is saved
            await info.save();
        } catch (e) {
            if (!(e instanceof DocumentNotFoundError)) {
                throw e;
            }
        }
    }

    async login(address, password, ip) {
        let userPhone;
        const userEmail = await UserAddressModel.findOne({ email: address });

        // checking is there such a phone number represented as a login only if the email check is failed
        // to prevent errors caused by parsing possible email address as phone number and for a little optimization
        if (!userEmail) {
            const numberObj = parsePhoneNumber(address);
            const internationalNumber = numberObj?.formatInternational();
            
            userPhone = await UserAddressModel.findOne({ phoneNumber: internationalNumber || address });
        }
        
        const userAddress =  userEmail || userPhone;
        if (!userAddress) {
            throw ApiError.BadRequest('User with such a login does not exist');
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
            async function createNewUserDevice() {
                const hashedIp = await bcrypt.hash(ip, 3);
                userDevice = await UserDeviceModel.create({ user: user._id, ip: hashedIp });
            }

            if (userDevices.length >= MAX_USER_DEVICES_AMOUNT) {
                // delete one user device before creating a new one
                const toBeDeletedUserDevice = await UserDeviceModel.findOne({ user: user._id });

                await UserDeviceModel.deleteOne({ user: user._id });
                await tokenModel.deleteOne({ userDevice: toBeDeletedUserDevice._id });
                await createNewUserDevice();
            } else {
                await createNewUserDevice();
            }
        }

        const userDto = new UserDto(user);
        const userDeviceDto = new UserDeviceDto(userDevice);
        const tokens = tokenService.generateTokens({...userDto});

        // we could login without account activation, so give activation info dto to client
        // even after user login
        const activationInfo = await ActivationInfoModel.findOne({ user: user._id }); 
        const activationInfoDto = new ActivationInfoDto(activationInfo);

        const addressDto = new UserAddressDto(userAddress);

        await tokenService.saveToken(userDevice._doc._id, tokens.refreshToken);
        return {...tokens, user: userDto, address: addressDto, activationInfo: activationInfoDto, userDevice: userDeviceDto};
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

        // refreshToken is unique, so if the given token exists in the DB,
        // we can find the user device (we were doing this with just ips but they're 
        // not the best way to do this because of existing of dynamic ones, system-wide ips etc.,
        // but when we combine this method with the check of refreshToken, it becomes very useful)
        let userDevice = null;
        if (tokenFromDb) {
            userDevice = await UserDeviceModel.findById(tokenFromDb.userDevice);
        }

        if (!userDevice) {
            throw ApiError.UnauthorizedError();
        }

        const isOldIpTheSame = await bcrypt.compare(ip, userDevice.ip);
        if (isOldIpTheSame) {
            userDevice.ip = await bcrypt.hash(ip, 3);
            await userDevice.save();
        }

        const userDto = new UserDto(user);
        const addressDto = new UserAddressDto(await UserAddressModel.findOne({ user: user._id }));
        
        const activationInfo = await ActivationInfoModel.findOne({ user: user._id }); 
        const activationInfoDto = new ActivationInfoDto(activationInfo);

        const emailsToConfirm = await EmailToConfirmModel.find({ user: user._id });
        const emailToConfirmDtos = emailsToConfirm.map(email => new EmailToConfirmDto(email));

        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDevice._id, tokens.refreshToken);

        return {
            ...tokens, 
            user: userDto, 
            address: addressDto, 
            activationInfo: activationInfoDto, 
            emailsToConfirm: emailToConfirmDtos
        };
    }

    async changeNameSurname(name, surname, userId) {
        const user = await UserModel.findById(userId);
  
        // doing these ugly conditions to not save changed user model twice if both name and surname were changed
        if (typeof name === "string" && typeof surname === "string") {
            if (user.name !== name || user.surname !== surname) {
                if (user.name !== name) {
                  user.name = name;
                }
    
                if (user.surname !== surname) {
                  user.surname = surname;
                }
    
                await user.save();
            }
        } else {
            throw ApiError.BadRequest("Given name or surname isn't string");
        }
  
        const userDto = new UserDto(user);
        return userDto;
    }

    async changePassword(currentPassword, newPassword, userId) {
        const user = await UserModel.findById(userId);

        const isCurrPaswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrPaswordValid) {
            throw ApiError.BadRequest('Incorrect current password');
        }

        const isNewPaswordTheSameAsTheOldOne = await bcrypt.compare(newPassword, currentPassword);
        if (isNewPaswordTheSameAsTheOldOne) {
            throw ApiError.BadRequest('The new password is the same as the old one');
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 3);
        user.password = hashNewPassword;

        await user.save();
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