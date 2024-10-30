module.exports = class ApiError extends Error {
    status;
    errors;
    shortErrorReason;

    constructor(status, message, options = { errors: [], shortErrorReason: null }) {
        super(message);
        this.status = status;
        this.errors = options.errors || [];
        this.shortErrorReason = options.shortErrorReason || null;
    }

    static UnauthorizedError() {
        return new ApiError(401, "User isn't authorized");
    }

    static ActivationError() {
        return new ApiError(403, "User hasn't activated his email");
    }

    static BadRequest(message, errors = [], shortErrorReason = null) {
        return new ApiError(400, message, { errors, shortErrorReason: shortErrorReason });
    }    
}
