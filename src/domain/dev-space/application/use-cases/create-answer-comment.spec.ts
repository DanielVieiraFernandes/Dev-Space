import { InMemoryDevelopersRepository } from '@/../test/repositories/in-memory-developers-repository';
import { makeDeveloper } from '../../../../../test/factories/make-developer';
import { makePost } from '../../../../../test/factories/make-post';
import { makePostComment } from '../../../../../test/factories/make-post-comment';
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository';
import { InMemoryPostCommentsRepository } from '../../../../../test/repositories/in-memory-post-comments-repository';
import { InMemoryPostsRepository } from '../../../../../test/repositories/in-memory-posts-repository';
import { CreateAnswerCommentUseCase } from './create-answer-comment';
import { CommentNotExistError } from './errors/comment-not-exist-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let sut: CreateAnswerCommentUseCase; // sut is System Under Test

describe('Create answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    sut = new CreateAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
      inMemoryPostCommentsRepository,
      inMemoryPostsRepository,
      inMemoryDevelopersRepository
    );
  });

  it('Should be able to create a new answer comment', async () => {
    inMemoryDevelopersRepository.items.push(makeDeveloper({}, 'author-1'));

    inMemoryPostsRepository.items.push(
      makePost(
        {
          authorId: 'author-1',
        },
        'post-1'
      )
    );

    inMemoryPostCommentsRepository.items.push(
      makePostComment(
        {
          postId: 'post-1',
          authorId: 'author-1',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-1',
      postId: 'post-1',
      commentId: 'comment-1',
      content: 'This is a answer comment',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'This is a answer comment'
    );
  });

  it('Should not be able to create a new answer comment when the post comment not exist', async () => {
    inMemoryDevelopersRepository.items.push(makeDeveloper({}, 'author-1'));

    inMemoryPostsRepository.items.push(
      makePost(
        {
          authorId: 'author-1',
        },
        'post-1'
      )
    );

    inMemoryPostCommentsRepository.items.push(
      makePostComment(
        {
          postId: 'post-1',
          authorId: 'author-1',
        },
        'comment-1'
      )
    );

    const result = await sut.execute({
      authorId: 'author-1',
      postId: 'post-1',
      commentId: 'comment-2',
      content: 'This is a answer comment',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(CommentNotExistError);
  });
});
