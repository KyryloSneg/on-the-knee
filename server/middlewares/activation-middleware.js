const ApiError = require('../exceptions/api-error');
const ActivationInfoModel = require('../models/activation-info-model');

module.exports = async function (req, res, next) {
    try {
        const activationInfo = await ActivationInfoModel.findOne({user: req.user.id});
        if (!activationInfo) {
          return next(ApiError.ActivationError());
        }

        if (!activationInfo.isActivated) {
          return next(ApiError.ActivationError());
        }

        next();
    } catch (e) {
        console.log(e);
        return next(ApiError.ActivationError());
    }
};
