class CustomError extends Error {
    constructor({ message, name, statusCode }) {
      super(message);
      this.name = name;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, CustomError);
    }
  }
  
  class ErrorBadRequest extends CustomError {
      constructor(message) {
        super({
          message,
          name: "HttpBadRequest",
          statusCode: 400,
        });
      }
    }

    class ErrorUnauthorized extends CustomError {
      constructor(message) {
        super({
          message,
          name: "HttpForbidden",
          statusCode: 401,
        });
      }
    }

    class ErrorNotFound extends CustomError {
      constructor(message) {
        super({
          message,
          name: "HttpNotFound",
          statusCode: 404,
        });
      }
    }
  
    class ErrorUnexpected extends CustomError {
      constructor(message) {
        super({
          message,
          name: "InternalServerError",
          statusCode: 500,
        });
      }
    }
  
    module.exports = {
      CustomError,
      ErrorBadRequest,
      ErrorUnexpected,
      ErrorUnauthorized,
      ErrorNotFound
    }