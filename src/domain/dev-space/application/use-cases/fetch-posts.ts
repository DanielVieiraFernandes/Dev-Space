import { Either, right } from '@/core/errors/either';
import { Post } from '../../enterprise/entities/post';
import { PostsRepository } from '../repositories/posts-repository';

interface FetchPostsUseCaseRequest {
  page: number;
  size: number;
  search?: string | null;
}

type FetchPostsUseCaseResponse = Either<
  null,
  {
    posts: Post[];
  }
>;

export class FetchPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute(
    params: FetchPostsUseCaseRequest
  ): Promise<FetchPostsUseCaseResponse> {
    const posts = await this.postsRepository.findMany(params);

    return right({
      posts,
    });
  }
}
