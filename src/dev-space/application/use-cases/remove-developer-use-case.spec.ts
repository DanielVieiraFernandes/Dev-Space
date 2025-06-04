import { InMemoryDevelopersRepository } from "@/../test/repositories/in-memory-developers-repository";
import { RemoveDeveloperUseCase } from "./remove-developer-use-case";
import { FakeHasher } from "@/../test/cryptography/fake-hasher";
import { makeDeveloper } from "../../../../test/factories/make-developer";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";

let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let fakeHasher: FakeHasher;
let sut: RemoveDeveloperUseCase; // sut is System Under Test

describe("Remove developer use case", () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    fakeHasher = new FakeHasher();
    sut = new RemoveDeveloperUseCase(inMemoryDevelopersRepository, fakeHasher);
  });

  it("Should be able to remove a developer account", async () => {
    const developer = makeDeveloper({});

    inMemoryDevelopersRepository.items.push(developer);

    const result = await sut.execute({
      developerId: developer.id,
      password: developer.password.split("-")[0], // pega a senha sem o sufixo "-hashed"
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryDevelopersRepository.items).toHaveLength(0);
  });

  it("Should not be able to remove a developer account when the account not exist", async () => {
    const result = await sut.execute({
      developerId: "user-not-exist-id",
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DeveloperNotExistError);
  });

  it("Should not be able to remove a developer account when the password is invalid", async () => {
    const developer = makeDeveloper({
      password: "123456-hashed",
      bio: null,
    });

    inMemoryDevelopersRepository.items.push(developer);

    const result = await sut.execute({
      developerId: developer.id,
      password: "123457",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
