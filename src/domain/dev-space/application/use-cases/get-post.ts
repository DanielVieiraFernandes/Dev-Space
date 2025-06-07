import { Either, left, right } from '@/core/errors/either';
import { Post } from '../../enterprise/entities/post';
import { PostsRepository } from '../repositories/posts-repository';
import { PostNotFoundError } from './errors/post-not-found-error';

interface GetPostUseCaseRequest {
  postId: string;
}

type GetPostUseCaseResponse = Either<PostNotFoundError, { post: Post }>;

export class GetPostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
  }: GetPostUseCaseRequest): Promise<GetPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new PostNotFoundError());
    }

    return right({ post });
  }
}
