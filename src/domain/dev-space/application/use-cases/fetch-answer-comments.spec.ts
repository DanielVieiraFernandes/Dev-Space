import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase; // sut is System Under Test

describe('Fetch answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('Should be able to fetch a answer comment', async () => {
    for (let i = 0; i < 15; i++) {
      inMemoryAnswerCommentsRepository.items.push(
        makeAnswerComment({
          authorId: `author-${i}`,
          commentId: `answer-${i}`,
          content: `This is a comment number ${i}`,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      size: 10,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.comments).toHaveLength(5);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'This is a comment number 10',
        }),
        expect.objectContaining({
          content: 'This is a comment number 11',
        }),
        expect.objectContaining({
          content: 'This is a comment number 12',
        }),
        expect.objectContaining({
          content: 'This is a comment number 13',
        }),
        expect.objectContaining({
          content: 'This is a comment number 14',
        }),
      ])
    );
  });

  it('Should be able to fetch a answer comment with search param', async () => {
    for (let i = 0; i < 20; i++) {
      inMemoryAnswerCommentsRepository.items.push(
        makeAnswerComment({
          authorId: `author-${i}`,
          commentId: `answer-${i}`,
          content: `This is a comment ${i % 2 === 0 ? 'pair' : 'odd'}}`,
        })
      );
    }

    const result = await sut.execute({
      page: 1,
      size: 10,
      search: 'pair',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.comments).toHaveLength(10);
  });
});
