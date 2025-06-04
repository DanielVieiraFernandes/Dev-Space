import { InMemoryDevelopersRepository } from "@/../test/repositories/in-memory-developers-repository";
import { UpdateDeveloperUseCase } from "./update-developer-use-case";
import { FakeHasher } from "@/../test/cryptography/fake-hasher";
import { makeDeveloper } from "../../../../test/factories/make-developer";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";

let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let fakeHasher: FakeHasher;
let sut: UpdateDeveloperUseCase; // sut is System Under Test

describe("Update developer use case", () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    fakeHasher = new FakeHasher();
    sut = new UpdateDeveloperUseCase(inMemoryDevelopersRepository, fakeHasher);
  });

  it("Should be able to update a developer account", async () => {
    const developer = makeDeveloper({
      password: "123456-hashed",
      bio: null,
    });

    inMemoryDevelopersRepository.items.push(developer);

    const result = await sut.execute({
      userId: developer.id,
      password: "123456",
      bio: "Bio alterada",
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryDevelopersRepository.items[0]).toEqual(
      expect.objectContaining({
        id: developer.id,
        bio: "Bio alterada",
      })
    );
  });

  it("Should not be able to update a developer account when the account not exist", async () => {
    const result = await sut.execute({
      userId: "user-not-exist-id",
      password: "123456",
      bio: "Bio alterada",
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
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
