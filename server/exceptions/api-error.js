module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, options = { errors: [] }) {
        super(message);
        this.status = status;
        this.errors = options.errors || [];
    }

    static UnauthorizedError() {
        return new ApiError(401, "User isn't authorized");
    }

    static ActivationError() {
        return new ApiError(403, "User hasn't activated his account");
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, { errors: errors });
    }    
}
