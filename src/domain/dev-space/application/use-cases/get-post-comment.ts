import { Either, left, right } from '@/core/errors/either';
import { Comment } from '../../enterprise/entities/comment';
import { PostCommentsRepository } from '../repositories/post-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';

interface GetPostCommentRequest {
  commentId: string;
}

type GetPostCommentResponse = Either<
  CommentNotExistError,
  {
    comment: Comment;
  }
>;

export class GetPostCommentUseCase {
  constructor(private postCommentsRepository: PostCommentsRepository) {}

  async execute({
    commentId,
  }: GetPostCommentRequest): Promise<GetPostCommentResponse> {
    const comment = await this.postCommentsRepository.findById(commentId);

    if (!comment) {
      return left(new CommentNotExistError());
    }

    return right({
      comment,
    });
  }
}
