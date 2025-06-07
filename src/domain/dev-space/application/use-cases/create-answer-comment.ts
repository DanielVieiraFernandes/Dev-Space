import { Either, left, right } from '@/core/errors/either';
import { Comment } from '../../enterprise/entities/comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { DevelopersRepository } from '../repositories/developers-repository';
import { PostCommentsRepository } from '../repositories/post-comments-repository';
import { PostsRepository } from '../repositories/posts-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';
import { DeveloperNotExistError } from './errors/developer-not-exist-error';
import { PostNotFoundError } from './errors/post-not-found-error';

interface CreateAnswerCommentUseCaseRequest {
  commentId: string;
  authorId: string;
  postId: string;
  content: string;
}

type CreateAnswerCommentUseCaseResponse = Either<
  PostNotFoundError | CommentNotExistError | DeveloperNotExistError,
  {}
>;

export class CreateAnswerCommentUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
    private postCommentsRepository: PostCommentsRepository,
    private postsRepository: PostsRepository,
    private developersRepository: DevelopersRepository
  ) {}

  async execute({
    commentId,
    authorId,
    postId,
    content,
  }: CreateAnswerCommentUseCaseRequest): Promise<CreateAnswerCommentUseCaseResponse> {
    const developer = await this.developersRepository.findById(authorId);
    if (!developer) {
      return left(new DeveloperNotExistError());
    }

    const comment = await this.postCommentsRepository.findById(commentId);

    if (!comment) {
      return left(new CommentNotExistError());
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new PostNotFoundError());
    }

    if (comment.postId !== postId) {
      return left(new PostNotFoundError());
    }

    const answerComment = Comment.create({
      authorId,
      content,
      postId,
      commentId,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({});
  }
}
