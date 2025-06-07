import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository';
import { RemoveAnswerCommentUseCase } from './remove-answer-comment';
import { UnAuthorizedError } from './errors/unauthorized-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: RemoveAnswerCommentUseCase; // sut is System Under Test

describe('Remove answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new RemoveAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it('Should be able to remove a answer comment', async () => {
    inMemoryAnswerCommentsRepository.items.push(
      makeAnswerComment(
        {
          authorId: 'author-1',
          content: 'This is an old comment',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-1',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it('Should not be able to remove a answer comment when credentials is invalid', async () => {
    inMemoryAnswerCommentsRepository.items.push(
      makeAnswerComment(
        {
          authorId: 'author-1',
          content: 'This is an old comment',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-2',
      commentId: 'comment-1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UnAuthorizedError);
  });
});
