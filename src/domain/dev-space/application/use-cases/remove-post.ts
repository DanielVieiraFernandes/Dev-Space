import { Either, left, right } from '@/core/errors/either';
import { PostsRepository } from '../repositories/posts-repository';
import { PostNotFoundError } from './errors/post-not-found-error';
import { UnAuthorizedError } from './errors/unauthorized-error';

interface RemovePostUseCaseRequest {
  authorId: string;
  postId: string;
}

type RemovePostUseCaseResponse = Either<
  PostNotFoundError | UnAuthorizedError,
  {}
>;

export class RemovePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    authorId,
    postId,
  }: RemovePostUseCaseRequest): Promise<RemovePostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new PostNotFoundError());
    }

    if (post.authorId !== authorId) {
      return left(new UnAuthorizedError());
    }

    await this.postsRepository.remove(postId);

    return right({});
  }
}
