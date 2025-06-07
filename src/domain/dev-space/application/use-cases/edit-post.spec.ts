import { makeDeveloper } from '@/../test/factories/make-developer';
import { makePost } from '@/../test/factories/make-post';
import { makePostAttachment } from '@/../test/factories/make-post-attachment';
import { InMemoryDevelopersRepository } from '@/../test/repositories/in-memory-developers-repository';
import { InMemoryPostAttachmentsRepository } from '@/../test/repositories/in-memory-posts-attachments-repository';
import { InMemoryPostsRepository } from '@/../test/repositories/in-memory-posts-repository';
import { EditPostUseCase } from './edit-post';
import { UnAuthorizedError } from './errors/unauthorized-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostAttachmentsRepository: InMemoryPostAttachmentsRepository;
let sut: EditPostUseCase; // sut is System Under Test

describe('Edit Post use case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryPostAttachmentsRepository = new InMemoryPostAttachmentsRepository();
    sut = new EditPostUseCase(
      inMemoryPostsRepository,
      inMemoryPostAttachmentsRepository,
      inMemoryDevelopersRepository
    );
  });

  it('Should be able to edit a post', async () => {
    const developer = makeDeveloper({
      password: '123456-hashed',
      bio: null,
    });

    inMemoryDevelopersRepository.items.push(developer);

    const post = makePost({
      authorId: developer.id,
      content: 'Conteúdo original do post',
    });

    inMemoryPostsRepository.items.push(post);

    inMemoryPostAttachmentsRepository.items.push(
      makePostAttachment({
        postId: post.id,
        attachmentId: '1',
      }),
      makePostAttachment({
        postId: post.id,
        attachmentId: '2',
      })
    );

    const result = await sut.execute({
      authorId: developer.id,
      postId: post.id,
      content: 'Conteúdo atualizado do post',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPostsRepository.items[0].content).toEqual(
      'Conteúdo atualizado do post'
    );
    expect(
      inMemoryPostsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryPostsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: '1',
      }),
      expect.objectContaining({
        attachmentId: '3',
      }),
    ]);
  });

  it('Should not be able to edit a post when sending invalid credentials', async () => {
    const developer = makeDeveloper({
      password: '123456-hashed',
      bio: null,
    });

    inMemoryDevelopersRepository.items.push(developer);

    const result = await sut.execute({
      authorId: developer.id,
      postId: 'post-not-exist-id',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("Should not be able to edit a post when user isn't authorized", async () => {
    const developer1 = makeDeveloper({}, 'developer-1');

    const developer2 = makeDeveloper({}, 'developer-2');

    inMemoryDevelopersRepository.items.push(developer1, developer2);

    const post = makePost({
      authorId: developer1.id,
      content: 'Conteúdo original do post',
    });

    inMemoryPostsRepository.items.push(post);

    const result = await sut.execute({
      authorId: 'developer-2',
      postId: post.id,
      attachmentsIds: ['1', '2'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UnAuthorizedError);
  });
});
