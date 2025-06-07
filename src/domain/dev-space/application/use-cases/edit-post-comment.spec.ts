import { makePostComment } from '../../../../../test/factories/make-post-comment';
import { InMemoryPostCommentsRepository } from '../../../../../test/repositories/in-memory-post-comments-repository';
import { EditPostCommentUseCase } from './edit-post-comment';
import { UnAuthorizedError } from './errors/unauthorized-error';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: EditPostCommentUseCase; // sut is System Under Test

describe('Edit post comment use case', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    sut = new EditPostCommentUseCase(inMemoryPostCommentsRepository);
  });

  it('Should be able to edit a post comment', async () => {
    inMemoryPostCommentsRepository.items.push(
      makePostComment(
        {
          authorId: 'author-1',
          postId: 'post-1',
          content: 'This is an old comment',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-1',
      postId: 'post-1',
      content: 'This is a new content for the comment',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPostCommentsRepository.items[0].content).toBe(
      'This is a new content for the comment'
    );
  });

  it('Should not be able to edit a post comment when credentials is invalid', async () => {
    inMemoryPostCommentsRepository.items.push(
      makePostComment(
        {
          authorId: 'author-1',
          postId: 'post-1',
          content: 'This is an old comment',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-2',
      postId: 'post-1',
      content: 'This is a new content for the comment',
      commentId: 'comment-1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UnAuthorizedError);
  });
});
