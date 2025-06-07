import { Either, left, right } from '@/core/errors/either';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';
import { UnAuthorizedError } from './errors/unauthorized-error';

interface RemoveAnswerCommentUseCaseRequest {
  commentId: string;
  authorId: string;
}

type RemoveAnswerCommentUseCaseResponse = Either<
  CommentNotExistError | UnAuthorizedError,
  {}
>;

export class RemoveAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    commentId,
    authorId,
  }: RemoveAnswerCommentUseCaseRequest): Promise<RemoveAnswerCommentUseCaseResponse> {
    const comment = await this.answerCommentsRepository.findById(commentId);

    if (!comment) {
      return left(new CommentNotExistError());
    }

    if (comment.authorId !== authorId) {
      return left(new UnAuthorizedError());
    }

    await this.answerCommentsRepository.remove(commentId);

    return right({});
  }
}
