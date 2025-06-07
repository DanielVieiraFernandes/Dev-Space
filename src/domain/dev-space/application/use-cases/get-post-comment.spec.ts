import { makePostComment } from '../../../../../test/factories/make-post-comment';
import { InMemoryPostCommentsRepository } from '../../../../../test/repositories/in-memory-post-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';
import { GetPostCommentUseCase } from './get-post-comment';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: GetPostCommentUseCase; // sut is System Under Test

describe('Get post comment use case', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    sut = new GetPostCommentUseCase(inMemoryPostCommentsRepository);
  });

  it('Should be able to get a post comment', async () => {
    inMemoryPostCommentsRepository.items.push(
      makePostComment(
        {
          content: 'This is a comment',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      commentId: 'comment-1',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      comment: expect.objectContaining({
        content: 'This is a comment',
      }),
    });
  });

  it('Should not be able to get a post comment when comment not exist', async () => {
    const result = await sut.execute({
      commentId: 'comment-1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(CommentNotExistError);
  });
});
