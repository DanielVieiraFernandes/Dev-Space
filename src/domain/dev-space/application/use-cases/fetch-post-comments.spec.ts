import { makePostComment } from '../../../../../test/factories/make-post-comment';
import { InMemoryPostCommentsRepository } from '../../../../../test/repositories/in-memory-post-comments-repository';
import { FetchPostCommentsUseCase } from './fetch-post-comments';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: FetchPostCommentsUseCase; // sut is System Under Test

describe('Fetch post comment use case', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    sut = new FetchPostCommentsUseCase(inMemoryPostCommentsRepository);
  });

  it('Should be able to fetch a post comment', async () => {
    for (let i = 0; i < 15; i++) {
      inMemoryPostCommentsRepository.items.push(
        makePostComment({
          authorId: `author-${i}`,
          postId: `post-${i}`,
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

  it('Should be able to fetch a post comment with search param', async () => {
    for (let i = 0; i < 20; i++) {
      inMemoryPostCommentsRepository.items.push(
        makePostComment({
          authorId: `author-${i}`,
          postId: `post-${i}`,
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
