import { makePost } from '@/../test/factories/make-post';
import { InMemoryPostsRepository } from '@/../test/repositories/in-memory-posts-repository';
import { GetPostUseCase } from './get-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: GetPostUseCase;

describe('Get post use case', () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    sut = new GetPostUseCase(inMemoryPostsRepository);
  });

  it('Should be able to get unique post', async () => {
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
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      post: expect.objectContaining({
        id: 'post-id-1',
        authorId: 'developer-id',
        content: 'Post content',
      }),
    });
  });
});
