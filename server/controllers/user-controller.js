const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const userAddressService = require("../service/user-address-service");

const isCurrentEnvPreviewOrProd = process.env?.VERCEL_ENV === "production" || process.env?.VERCEL_ENV === "preview";
function setCookie(response, name, value, options = {}) {
    let previewOrProdOptions = {};
    if (isCurrentEnvPreviewOrProd) {
        // setting these options because otherwise browser couldn't save a cookie
        // (at least the Chrome 80+ stable)
        previewOrProdOptions.secure = true;
        previewOrProdOptions.sameSite = "None";
    }

    response.cookie(name, value, { ...options, ...previewOrProdOptions, httpOnly: true })
}

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            const { name, surname, password, email, phoneNumber } = req.body;
            const { userData, userDeviceInfos } = await userService.registration(name, surname, password, email, phoneNumber);

            setCookie(res, 'refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000});
            setCookie(res, 'userDeviceInfos', JSON.stringify(userDeviceInfos));

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { userDeviceInfos } = req.cookies;
            const parsedUserDeviceInfos = userDeviceInfos ? JSON.parse(userDeviceInfos) : null;

            const { address, password } = req.body; // address = email || phoneNumber
            const { userData, newUserDeviceInfos } = await userService.login(address, password, parsedUserDeviceInfos);
            
            setCookie(res, 'refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000});
            setCookie(res, 'userDeviceInfos', JSON.stringify(newUserDeviceInfos));

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);

            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async createRole(req, res, next) {
        try {
            const { value } = req.body;
            const role = await userService.createRole(value);
            return role;
        } catch (e) {
            next(e);
        }
    }

    async addRole(req, res, next) {
        try {
            const { value, userId } = req.body;
            const roles = await userService.addRole(value, userId);
            return res.json(roles);
        } catch (e) {
            next(e);
        }
    }

    async deleteRole(req, res, next) {
        try {
            const { value, userId } = req.body;
            const role = await userService.deleteRole(value, userId);
            return res.json(role);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            const type = req.query.type;

            await userService.activate(activationLink, type);
            return res.redirect(process.env.CLIENT_URL + process.env.CLIENT_EMAIL_CONFIRMATION_SUCCESS_ROUTE);
        } catch (e) {
            return res.redirect(process.env.CLIENT_URL + process.env.CLIENT_EMAIL_CONFIRMATION_FAILURE_ROUTE);
        }
    }

    async sendShortTermActivationEmail(req, res, next) {
        try {
            const user = req.user;
            await userService.sendShortTermActivationEmail(user);
            
            // returning null in order to not get 404 on the client side
            return res.json(null);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken, userDeviceInfos } = req.cookies;
            const parsedUserDeviceInfos = userDeviceInfos ? JSON.parse(userDeviceInfos) : null;
            const { userData, newUserDeviceInfos } = await userService.refresh(refreshToken, parsedUserDeviceInfos);

            setCookie(res, 'refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000});
            setCookie(res, 'userDeviceInfos', JSON.stringify(newUserDeviceInfos));

            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async changeEmail(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            
            const { email } = req.body;
            const user = req.user;

            const emailsToConfirm = await userAddressService.changeEmail(email, user.id);
            return res.json(emailsToConfirm);
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    async changePhoneNumber(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            
            const { phoneNumber } = req.body;
            const user = req.user;

            const address = await userAddressService.changePhoneNumber(phoneNumber, user.id);
            return res.json(address);
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    async changeNameSurname(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            
            const { name, surname } = req.body;
            const user = req.user;

            const userWithNewNames = await userService.changeNameSurname(name, surname, user.id);
            return res.json(userWithNewNames);
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    async changePassword(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            
            const { currentPassword, newPassword } = req.body;
            const user = req.user;

            await userService.changePassword(currentPassword, newPassword, user.id);
            next();

            // returning null in order to not get 404 on the client side
            return res.json(null);
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    async getUserEmailsToConfirm(req, res, next) {
        try {
            const user = req.user;
            const emailsToConfirm = await userAddressService.getUserEmailsToConfirm(user.id);
            
            return res.json(emailsToConfirm);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            // /:id?isDto=true
            const id = req.params.id;
            const isDto = !!req.query.isDto;
            const user = await userService.getUser(id, isDto);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new UserController();
