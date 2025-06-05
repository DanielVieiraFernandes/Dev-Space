export class UnAuthorizedError extends Error {
  constructor() {
    super("Unauthorized access");
  }
}
