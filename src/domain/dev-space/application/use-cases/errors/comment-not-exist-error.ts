export class CommentNotExistError extends Error {
  constructor() {
    super('Comment does not exist');
  }
}
