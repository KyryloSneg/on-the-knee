const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
const { MAX_TOKENS_AMOUNT_PER_USER } = require("../consts");

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(refreshToken, userId, isToCreateNewOne = false) {
        if (!isToCreateNewOne) {
            const tokenData = await this.findToken(refreshToken);
            if (tokenData) {
                return await tokenModel.updateOne({ user: userId, refreshToken }, { refreshToken: refreshToken });
            }
        }

        let token;
        const allTokens = await tokenModel.find({ user: userId });

        if (allTokens.length >= MAX_TOKENS_AMOUNT_PER_USER) {
            // delete one token and create a new one
            await tokenModel.deleteOne({ user: userId });
            token = await tokenModel.create({ user: userId, refreshToken });
        } else {
            token = await tokenModel.create({ user: userId, refreshToken });
        }

        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();
