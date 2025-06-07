import { Either, right } from '@/core/errors/either';
import { Comment } from '../../enterprise/entities/comment';
import { PostCommentsRepository } from '../repositories/post-comments-repository';

interface FetchPostCommentsUseCaseRequest {
  page: number;
  size: number;
  search?: string | null;
}

type FetchPostCommentsUseCaseResponse = Either<
  null,
  {
    comments: Comment[];
  }
>;

export class FetchPostCommentsUseCase {
  constructor(private postCommentsRepository: PostCommentsRepository) {}

  async execute(params: FetchPostCommentsUseCaseRequest): Promise<FetchPostCommentsUseCaseResponse> {
    const comments = await this.postCommentsRepository.findMany(params);

    return right({
      comments,
    });
  }
}
