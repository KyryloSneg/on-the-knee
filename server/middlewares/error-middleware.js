const ApiError = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json(
            { 
                message: err.message, 
                errors: err.errors, 
                shortErrorReason: err.shortErrorReason 
            }
        )
    }
    
    console.log(err);
    return res.status(500).json({message: 'Unexpected error'})
};
