import { FakeHasher } from '@/../test/cryptography/fake-hasher';
import { InMemoryDevelopersRepository } from '@/../test/repositories/in-memory-developers-repository';
import { makeDeveloper } from '../../../../../test/factories/make-developer';
import { DeveloperAlreadyExistError } from './errors/developer-already-exist-error';
import { RegisterDeveloperUseCase } from './register-developer';

let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let fakeHasher: FakeHasher;
let sut: RegisterDeveloperUseCase; // sut is System Under Test

describe('Create a developer account use case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterDeveloperUseCase(
      inMemoryDevelopersRepository,
      fakeHasher
    );
  });

  it('Should be able to create a new developer account', async () => {
    const result = await sut.execute({
      name: 'Daniel',
      email: 'daniel@email.com',
      password: '123456',
      bio: null,
      attachmentsIds: ['1'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryDevelopersRepository.items[0]).toEqual(
      expect.objectContaining({
        email: 'daniel@email.com',
        password: '123456-hashed',
        bio: null,
      })
    );
    expect(
      inMemoryDevelopersRepository.items[0].attachments.currentItems
    ).toHaveLength(1);
    expect(
      inMemoryDevelopersRepository.items[0].attachments.currentItems[0]
    ).toEqual(
      expect.objectContaining({
        attachmentId: '1',
      })
    );
  });

  it('Should not be able to create a new developer account when this account already exists', async () => {
    await inMemoryDevelopersRepository.create(
      makeDeveloper({
        name: 'Daniel',
        email: 'daniel@email.com',
        password: '123456',
        bio: null,
      })
    );

    const result = await sut.execute({
      name: 'Daniel',
      email: 'daniel@email.com',
      password: '123456',
      bio: null,
      attachmentsIds: ['1'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DeveloperAlreadyExistError);
  });
});
