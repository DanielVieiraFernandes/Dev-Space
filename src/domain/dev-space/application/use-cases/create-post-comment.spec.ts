import { InMemoryDevelopersRepository } from '@/../test/repositories/in-memory-developers-repository';
import { makeDeveloper } from '../../../../../test/factories/make-developer';
import { makePost } from '../../../../../test/factories/make-post';
import { InMemoryPostCommentsRepository } from '../../../../../test/repositories/in-memory-post-comments-repository';
import { InMemoryPostsRepository } from '../../../../../test/repositories/in-memory-posts-repository';
import { CreatePostCommentUseCase } from './create-post-comment';
import { DeveloperNotExistError } from './errors/developer-not-exist-error';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let sut: CreatePostCommentUseCase; // sut is System Under Test

describe('Create post comment use case', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    sut = new CreatePostCommentUseCase(
      inMemoryPostCommentsRepository,
      inMemoryPostsRepository,
      inMemoryDevelopersRepository
    );
  });

  it('Should be able to create a new post comment', async () => {
    inMemoryDevelopersRepository.items.push(makeDeveloper({}, 'author-1'));

    inMemoryPostsRepository.items.push(
      makePost(
        {
          authorId: 'author-1',
        },
        'post-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-1',
      postId: 'post-1',
      content: 'This is a new comment',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPostCommentsRepository.items).toHaveLength(1);
    expect(inMemoryPostCommentsRepository.items[0].content).toEqual(
      'This is a new comment'
    );
    expect(inMemoryPostCommentsRepository.items[0].authorId).toEqual(
      'author-1'
    );
    expect(inMemoryPostCommentsRepository.items[0].postId).toEqual('post-1');
  });

  it('Should not be able to create a new post comment when the developer not exist', async () => {
    inMemoryPostsRepository.items.push(
      makePost(
        {
          authorId: 'author-1',
        },
        'post-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-1',
      postId: 'post-1',
      content: 'This is a new comment',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DeveloperNotExistError);
  });
});
