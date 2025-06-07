import { Either, left, right } from '@/core/errors/either';
import { Comment } from '../../enterprise/entities/comment';
import { DevelopersRepository } from '../repositories/developers-repository';
import { PostCommentsRepository } from '../repositories/post-comments-repository';
import { PostsRepository } from '../repositories/posts-repository';
import { DeveloperNotExistError } from './errors/developer-not-exist-error';
import { PostNotFoundError } from './errors/post-not-found-error';

interface CreatePostCommentUseCaseRequest {
  authorId: string;
  postId: string;
  content: string;
}

type CreatePostCommentUseCaseResponse = Either<
  DeveloperNotExistError | PostNotFoundError,
  { success?: boolean }
>;

export class CreatePostCommentUseCase {
  constructor(
    private postCommentsRepository: PostCommentsRepository,
    private postsRepository: PostsRepository,
    private developersRepository: DevelopersRepository
  ) {}

  async execute({
    authorId,
    content,
    postId,
  }: CreatePostCommentUseCaseRequest): Promise<CreatePostCommentUseCaseResponse> {
    const developer = await this.developersRepository.findById(authorId);

    if (!developer) {
      return left(new DeveloperNotExistError());
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new PostNotFoundError());
    }

    const comment = Comment.create({
      authorId,
      postId,
      content,
    });

    await this.postCommentsRepository.create(comment);

    return right({
      success: true,
    });
  }
}
