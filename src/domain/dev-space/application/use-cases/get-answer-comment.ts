import { Either, left, right } from '@/core/errors/either';
import { Comment } from '../../enterprise/entities/comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';

interface GetAnswerCommentRequest {
  commentId: string;
}

type GetAnswerCommentResponse = Either<
  CommentNotExistError,
  {
    comment: Comment;
  }
>;

export class GetAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    commentId,
  }: GetAnswerCommentRequest): Promise<GetAnswerCommentResponse> {
    const comment = await this.answerCommentsRepository.findById(commentId);

    if (!comment) {
      return left(new CommentNotExistError());
    }

    return right({
      comment,
    });
  }
}
