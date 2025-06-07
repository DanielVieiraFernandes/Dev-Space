import { makePost } from '@/../test/factories/make-post';
import { InMemoryPostsRepository } from '@/../test/repositories/in-memory-posts-repository';
import { UnAuthorizedError } from './errors/unauthorized-error';
import { RemovePostUseCase } from './remove-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: RemovePostUseCase;

describe('Get post use case', () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    sut = new RemovePostUseCase(inMemoryPostsRepository);
  });

  it('Should be able to remove a unique post', async () => {
    inMemoryPostsRepository.items.push(
      makePost(
        {
          authorId: `developer-id`,
          content: `Post content`,
        },
        'post-id-1'
      )
    );

    const result = await sut.execute({
      postId: 'post-id-1',
      authorId: 'developer-id',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPostsRepository.items).toHaveLength(0);
  });

  it('Should not be able to remove a post when user isnt authorized', async () => {
    inMemoryPostsRepository.items.push(
      makePost(
        {
          authorId: `developer-id`,
          content: `Post content`,
        },
        'post-id-1'
      )
    );

    const result = await sut.execute({
      postId: 'post-id-1',
      authorId: 'developer-id-2',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UnAuthorizedError);
  });
});
