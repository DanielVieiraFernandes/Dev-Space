import { makePostComment } from '../../../../../test/factories/make-post-comment';
import { InMemoryPostCommentsRepository } from '../../../../../test/repositories/in-memory-post-comments-repository';
import { RemovePostCommentUseCase } from './remove-post-comment';
import { UnAuthorizedError } from './errors/unauthorized-error';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: RemovePostCommentUseCase; // sut is System Under Test

describe('Remove post comment use case', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    sut = new RemovePostCommentUseCase(inMemoryPostCommentsRepository);
  });

  it('Should be able to remove a post comment', async () => {
    inMemoryPostCommentsRepository.items.push(
      makePostComment(
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
    expect(inMemoryPostCommentsRepository.items).toHaveLength(0);
  });

  it('Should not be able to remove a post comment when credentials is invalid', async () => {
    inMemoryPostCommentsRepository.items.push(
      makePostComment(
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
