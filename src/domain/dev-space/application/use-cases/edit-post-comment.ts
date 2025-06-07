import { Either, left, right } from '@/core/errors/either';
import { PostCommentsRepository } from '../repositories/post-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';
import { UnAuthorizedError } from './errors/unauthorized-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface EditPostCommentRequest {
  authorId: string;
  postId: string;
  commentId: string;
  content: string;
}

type EditPostCommentResponse = Either<
  WrongCredentialsError | UnAuthorizedError | CommentNotExistError,
  {
    success?: boolean;
  }
>;

export class EditPostCommentUseCase {
  constructor(private postCommentsRepository: PostCommentsRepository) {}

  async execute({
    authorId,
    commentId,
    postId,
    content,
  }: EditPostCommentRequest): Promise<EditPostCommentResponse> {
    const comment = await this.postCommentsRepository.findById(commentId);

    if (!comment) {
      return left(new CommentNotExistError());
    }

    if (comment.postId !== postId) {
      return left(new WrongCredentialsError());
    }

    if (comment.authorId !== authorId) {
      return left(new UnAuthorizedError());
    }

    comment.content = content;

    await this.postCommentsRepository.save(comment);

    return right({
      success: true,
    });
  }
}
