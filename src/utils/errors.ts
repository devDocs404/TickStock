export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public errors: string[] = []
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", errors: string[] = []) {
    super(401, message, true, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", errors: string[] = []) {
    super(403, message, true, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", errors: string[] = []) {
    super(404, message, true, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", errors: string[] = []) {
    super(409, message, true, errors);
  }
}
