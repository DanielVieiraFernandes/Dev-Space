import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository';
import { CommentNotExistError } from './errors/comment-not-exist-error';
import { GetAnswerCommentUseCase } from './get-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: GetAnswerCommentUseCase; // sut is System Under Test

describe('Get answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new GetAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it('Should be able to get a answer comment', async () => {
    inMemoryAnswerCommentsRepository.items.push(
      makeAnswerComment(
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

  it('Should not be able to get a answer comment when comment not exist', async () => {
    const result = await sut.execute({
      commentId: 'comment-1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(CommentNotExistError);
  });
});
