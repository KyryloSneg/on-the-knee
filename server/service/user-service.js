const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const UserAddressModel = require('../models/user-address-model');
const ActivationInfoModel = require('../models/activation-info-model');
const RoleModel = require('../models/role-model');
const ActivationInfoDto = require('../dtos/activation-info-dto');
const UserAddressDto = require('../dtos/user-address-dto');
const { parsePhoneNumber } = require('libphonenumber-js');
const { SHORT_TERM_EMAIL_EXPIRES_AFTER_S } = require("../consts");
const tokenModel = require("../models/token-model");
const EmailToConfirmModel = require("../models/email-to-confirm-model");
const DocumentNotFoundError = require("mongoose/lib/error/notFound");
const EmailToConfirmDto = require("../dtos/email-to-confirm-dto");
const ShortTermActivationEmailModel = require("../models/short-term-activation-model");
const { Error } = require("mongoose");

class UserService {
    async registration(name, surname, password, email, phoneNumber) {
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

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); // id, name, surname, roles
        const tokens = tokenService.generateTokens({...userDto});
        const token = await tokenService.saveToken(tokens.refreshToken, user._id, true);

        const infoDto = new ActivationInfoDto(activationInfo);
        const addressDto = new UserAddressDto(userAddress);

        const userData = { ...tokens, user: userDto, address: addressDto, activationInfo: infoDto };
        const userDeviceInfos = [{ user: user._id, token: token._id }];

        return { userData, userDeviceInfos };
    }

    async activate(activationLink, type = "default") {
        let info;
        if (type === "changeEmail") {
            info = await EmailToConfirmModel.findOne({confirmationLink: activationLink});
        } else if (type === "shortTermEmail") {
            info = await ShortTermActivationEmailModel.findOne({activationLink})
        } else {
            info = await ActivationInfoModel.findOne({activationLink});
        }

        if (!info) {
            throw ApiError.BadRequest('Incorrect activation link')
        }

        if (type === "changeEmail") {
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
        } else if (type === "shortTermEmail") {
            // if the email's email and user one aren't the same, throw an error
            // else activate user email and delete short term email
            const address = await UserAddressModel.findOne({user: info.user})
            if (info.email !== address.email) {
                throw ApiError.BadRequest("The email had already been changed at the time of this mail's existence");
            }

            const activationInfo = await ActivationInfoModel.findOne({user: info.user});
            // just in case
            if (!activationInfo.isActivated) {
                activationInfo.isActivated = true;
                await activationInfo.save();
            }

            // there could be only one short term mail at the time
            await ShortTermActivationEmailModel.deleteOne({user: info.user});
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

    async sendShortTermActivationEmail(user) {
        const existingShortTermEmail = await ShortTermActivationEmailModel.findOne({ user: user.id });
        if (existingShortTermEmail) {
            throw ApiError.BadRequest('The email has already been sent');
        }

        const userAddress = await UserAddressModel.findOne({ user: user.id });

        const activationLink = uuid.v4();
        const linkForEmail = `${process.env.API_URL}/api/activate/${activationLink}?type=shortTermEmail`;

        const expireDurationString = `${SHORT_TERM_EMAIL_EXPIRES_AFTER_S} seconds`;

        await ShortTermActivationEmailModel.create({ user: user.id, email: userAddress.email, activationLink: activationLink });
        await mailService.sendActivationMail(userAddress.email, linkForEmail, expireDurationString);
    }

    async login(address, password, userDeviceInfos) {
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

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        // we could login without account activation, so give activation info dto to client
        // even after user login
        const activationInfo = await ActivationInfoModel.findOne({ user: user._id }); 
        const activationInfoDto = new ActivationInfoDto(activationInfo);

        const addressDto = new UserAddressDto(userAddress);

        let token;
        // i can't trust the cookies i think
        const userDeviceInfo = userDeviceInfos?.find?.(info => info?.user === user.id);
        const hasFoundDeviceInfoToUse = !!userDeviceInfo?.token;
        let isTokenFromCookiesValid = hasFoundDeviceInfoToUse;

        if (hasFoundDeviceInfoToUse) {
            let tokenData;
            try {
                // it's easier to use these methods manually rather than from the tokenService
                // in this case
                tokenData = await tokenModel.findById(userDeviceInfo.token);
            } catch(e) {
                // we must skip CastError because the token from the cookies could be invalid value
                if (e instanceof Error.CastError) {
                    isTokenFromCookiesValid = false;
                } else {
                    throw e;
                }
            }

            if (tokenData) {
                token = await tokenModel.findByIdAndUpdate(tokenData._id, { refreshToken: tokens.refreshToken });
            } else {
                // token could be deleted 'cause of the limit of tokens per user,
                // so create a new one
                token = await tokenService.saveToken(tokens.refreshToken, user._id, true);
            }
        } else {
            token = await tokenService.saveToken(tokens.refreshToken, user._id, true);
        }

        const userData = { ...tokens, user: userDto, address: addressDto, activationInfo: activationInfoDto };
        const possibleNewUserDeviceInfo = { user: user._id, token: token._id };

        let newUserDeviceInfos;
        if (isTokenFromCookiesValid) {
            newUserDeviceInfos = userDeviceInfos;
        } else {
            if (Array.isArray(userDeviceInfos)) {
                // filter user device infos from infos that don't include fields we use
                // and from the token that we have checked recently
                const filteredUserDeviceInfos = userDeviceInfos.filter(info => {
                    const isTheSameTokenThatWeChecked = info?.token === userDeviceInfo?.token;
                    return info?.user && info?.token && !isTheSameTokenThatWeChecked;
                });

                newUserDeviceInfos = [...filteredUserDeviceInfos, possibleNewUserDeviceInfo];
            } else {
                newUserDeviceInfos = [possibleNewUserDeviceInfo];
            }
        }

        return { userData, newUserDeviceInfos };
    }

    async logout(refreshToken) {
        const token = await tokenService.findToken(refreshToken);
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

    async refresh(refreshToken, userDeviceInfos) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);

        // if we have deleted the related token from DB, handle it later on
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);

        const userDto = new UserDto(user);
        const addressDto = new UserAddressDto(await UserAddressModel.findOne({ user: user._id }));
        
        const activationInfo = await ActivationInfoModel.findOne({ user: user._id }); 
        const activationInfoDto = new ActivationInfoDto(activationInfo);

        const emailsToConfirm = await EmailToConfirmModel.find({ user: user._id });
        const emailToConfirmDtos = emailsToConfirm.map(email => new EmailToConfirmDto(email));

        let token;
        const tokens = tokenService.generateTokens({...userDto});

        // i can't trust the cookies i think
        const userDeviceInfo = userDeviceInfos?.find?.(info => info?.user === user.id);
        const hasFoundDeviceInfoToUse = !!userDeviceInfo?.token;
        let isTokenFromCookiesValid = hasFoundDeviceInfoToUse;

        if (hasFoundDeviceInfoToUse) {
            try {
                token = await tokenModel.findById(userDeviceInfo.token);
            } catch(e) {
                // we must skip CastError because the token from the cookies could be invalid value
                if (e instanceof Error.CastError) {
                    isTokenFromCookiesValid = false;
                } else {
                    throw e;
                }
            }

            if (token) {
                token.refreshToken = tokens.refreshToken;
                await token.save();
            } else {
                // token could be deleted 'cause of the limit of tokens per user,
                // so create a new one
                token = await tokenService.saveToken(tokens.refreshToken, user._id, true);
            }
        } else {
            // i'm not confident in using this condition,
            // but possibly it improves security a bit
            const tokenFromDB = await tokenService.findToken(refreshToken);
            if (tokenFromDB) {
                token = await tokenService.saveToken(tokens.refreshToken, user._id, true);
            } 
        }

        const returnUserData = {
            ...tokens, 
            user: userDto, 
            address: addressDto, 
            activationInfo: activationInfoDto, 
            emailsToConfirm: emailToConfirmDtos
        };


        let newUserDeviceInfos;
        if (isTokenFromCookiesValid) {
            newUserDeviceInfos = userDeviceInfos;
        } else {
            const possibleNewUserDeviceInfo = token?._id ? { user: user._id, token: token._id } : null;

            if (Array.isArray(userDeviceInfos)) {
                // filter user device infos from infos that don't include fields we use
                // and from the token that we have checked recently
                const filteredUserDeviceInfos = userDeviceInfos.filter(info => {
                    const isTheSameTokenThatWeChecked = info?.token === userDeviceInfo?.token;
                    return info?.user && info?.token && !isTheSameTokenThatWeChecked;
                });

                newUserDeviceInfos = possibleNewUserDeviceInfo ? [...filteredUserDeviceInfos, possibleNewUserDeviceInfo] : [];
            } else {
                newUserDeviceInfos = possibleNewUserDeviceInfo ? [possibleNewUserDeviceInfo] : [];
            }
        }

        return { userData: returnUserData, newUserDeviceInfos };
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