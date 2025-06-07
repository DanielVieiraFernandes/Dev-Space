export class DeveloperAlreadyExistError extends Error {
  constructor() {
    super("Developer already exist");
  }
}
