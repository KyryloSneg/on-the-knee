const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            const {name, surname, password, email, phoneNumber, ip} = req.body;
            const userData = await userService.registration(name, surname, password, email, phoneNumber, ip);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {address, password, ip} = req.body; // address = email || phoneNumber
            const userData = await userService.login(address, password, ip);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
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
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { ip } = req.body;
            const userData = await userService.refresh(refreshToken, ip);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async changeAddress(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            
            const { email, phoneNumber } = req.body;
            const user = req.user;

            const address = await userService.changeUserAddress(email, phoneNumber, user.id);
            return res.json(address);
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
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
