import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository';
import { EditAnswerCommentUseCase } from './edit-answer-comment';
import { UnAuthorizedError } from './errors/unauthorized-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: EditAnswerCommentUseCase; // sut is System Under Test

describe('Edit answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new EditAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it('Should be able to edit a answer comment', async () => {
    inMemoryAnswerCommentsRepository.items.push(
      makeAnswerComment(
        {
          authorId: 'author-1',
          content: 'This is a old content for the comment',
        },
        'answer-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-1',
      answerCommentId: 'answer-1',
      content: 'This is a new content for the comment',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerCommentsRepository.items[0].content).toBe(
      'This is a new content for the comment'
    );
  });

  it('Should not be able to edit a answer comment when credentials is invalid', async () => {
    inMemoryAnswerCommentsRepository.items.push(
      makeAnswerComment(
        {
          authorId: 'author-1',
          content: 'This is an old comment',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: 'comment-1',
      content: 'This is a new content for the comment',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UnAuthorizedError);
  });
});
