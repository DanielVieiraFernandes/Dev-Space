import { Either, right } from '@/core/errors/either';
import { Comment } from '../../enterprise/entities/comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
  page: number;
  size: number;
  search?: string | null;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: Comment[];
  }
>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute(params: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments = await this.answerCommentsRepository.findMany(params);

    return right({
      comments,
    });
  }
}
