import { makePost } from '@/../test/factories/make-post';
import { InMemoryPostsRepository } from '@/../test/repositories/in-memory-posts-repository';
import { FetchPostsUseCase } from './fetch-posts';

let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: FetchPostsUseCase; // sut is System Under Test

describe('Fetch Posts use case', () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();

    sut = new FetchPostsUseCase(inMemoryPostsRepository);
  });

  it('Should be able to fetch posts', async () => {
    for (let i = 0; i < 15; i++) {
      inMemoryPostsRepository.items.push(
        makePost({
          authorId: `developer-${i}`,
          content: `Post content ${i}`,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      size: 10,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.posts).toHaveLength(5);
  });

  it('Should be able to fetch posts', async () => {
    for (let i = 0; i < 16; i++) {
      inMemoryPostsRepository.items.push(
        makePost({
          authorId: `developer-${i}`,
          content: `${i % 2 == 0 ? 'pair post' : 'odd post'} ${i}`,
        })
      );
    }

    const result = await sut.execute({
      page: 1,
      size: 10,
      search: 'pair',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.posts).toHaveLength(8);
  });
});
