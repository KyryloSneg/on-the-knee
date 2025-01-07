class ApiError extends Error {
  status;

  constructor(status, message) {
      super(message);
      this.status = status;
  }

  static NotFoundError() {
      return new ApiError(404, "Not found");
  } 
}

export default ApiError;