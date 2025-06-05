import { InMemoryDevelopersRepository } from "@/../test/repositories/in-memory-developers-repository";
import { UpdateDeveloperUseCase } from "./update-developer";
import { FakeHasher } from "@/../test/cryptography/fake-hasher";
import { makeDeveloper } from "../../../../../test/factories/make-developer";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";
import { InMemoryDeveloperAttachmentsRepository } from "../../../../../test/repositories/in-memory-developer-attachments-repository";
import { makeDeveloperAttachment } from "../../../../../test/factories/make-developer-attachment";

let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let inMemoryDeveloperAttachmentsRepository: InMemoryDeveloperAttachmentsRepository;
let fakeHasher: FakeHasher;
let sut: UpdateDeveloperUseCase; // sut is System Under Test

describe("Update developer use case", () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    inMemoryDeveloperAttachmentsRepository =
      new InMemoryDeveloperAttachmentsRepository();
    fakeHasher = new FakeHasher();
    sut = new UpdateDeveloperUseCase(
      inMemoryDevelopersRepository,
      inMemoryDeveloperAttachmentsRepository,
      fakeHasher
    );
  });

  it("Should be able to update a developer account", async () => {
    const developer = makeDeveloper({
      password: "123456-hashed",
      bio: null,
    });

    inMemoryDevelopersRepository.items.push(developer);

    inMemoryDeveloperAttachmentsRepository.items.push(
      makeDeveloperAttachment({}, "1"),
      makeDeveloperAttachment({}, "2")
    );

    const result = await sut.execute({
      userId: developer.id,
      password: "123456",
      bio: "Bio alterada",
      attachmentsIds: ["1", "3"],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryDevelopersRepository.items[0]).toEqual(
      expect.objectContaining({
        id: developer.id,
        bio: "Bio alterada",
      })
    );
    expect(
      inMemoryDevelopersRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryDevelopersRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({
        attachmentId: "1",
      }),
      expect.objectContaining({
        attachmentId: "3",
      }),
    ]);
  });

  it("Should not be able to update a developer account when the account not exist", async () => {
    const result = await sut.execute({
      userId: "user-not-exist-id",
      password: "123456",
      bio: "Bio alterada",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DeveloperNotExistError);
  });

  it("Should not be able to update a developer account when the password is invalid", async () => {
    const developer = makeDeveloper({
      password: "123456-hashed",
      bio: null,
    });

    inMemoryDevelopersRepository.items.push(developer);

    const result = await sut.execute({
      userId: developer.id,
      password: "123457",
      bio: "Bio alterada",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
