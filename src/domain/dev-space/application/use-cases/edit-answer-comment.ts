import { Either, left, right } from '@/core/errors/either';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';
import { UnAuthorizedError } from './errors/unauthorized-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface EditAnswerCommentRequest {
  authorId: string;
  answerCommentId: string;
  content: string;
}

type EditAnswerCommentResponse = Either<
  WrongCredentialsError | UnAuthorizedError | CommentNotExistError,
  {
    success?: boolean;
  }
>;

export class EditAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
    content,
  }: EditAnswerCommentRequest): Promise<EditAnswerCommentResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new CommentNotExistError());
    }

    if (answerComment.authorId !== authorId) {
      return left(new UnAuthorizedError());
    }

    answerComment.content = content;

    await this.answerCommentsRepository.save(answerComment);

    return right({
      success: true,
    });
  }
}
