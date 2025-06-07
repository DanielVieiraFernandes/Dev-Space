import { Either, left, right } from '@/core/errors/either';
import { PostCommentsRepository } from '../repositories/post-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';
import { UnAuthorizedError } from './errors/unauthorized-error';

interface RemovePostCommentUseCaseRequest {
  commentId: string;
  authorId: string;
}

type RemovePostCommentUseCaseResponse = Either<
  CommentNotExistError | UnAuthorizedError,
  {}
>;

export class RemovePostCommentUseCase {
  constructor(private postCommentsRepository: PostCommentsRepository) {}

  async execute({
    commentId,
    authorId,
  }: RemovePostCommentUseCaseRequest): Promise<RemovePostCommentUseCaseResponse> {
    const comment = await this.postCommentsRepository.findById(commentId);

    if (!comment) {
      return left(new CommentNotExistError());
    }

    if (comment.authorId !== authorId) {
      return left(new UnAuthorizedError());
    }

    await this.postCommentsRepository.remove(commentId);

    return right({});
  }
}
