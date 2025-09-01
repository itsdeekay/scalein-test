export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
  static badRequest(msg = 'Bad Request') {
    return new HttpError(400, msg);
  }
  static unauthorized(msg = 'Unauthorized') {
    return new HttpError(401, msg);
  }
  static forbidden(msg = 'Forbidden') {
    return new HttpError(403, msg);
  }
  static notFound(msg = 'Not Found') {
    return new HttpError(404, msg);
  }
  static conflict(msg = 'Conflict') {
    return new HttpError(409, msg);
  }
}