import { InMemoryDevelopersRepository } from "@/../test/repositories/in-memory-developers-repository";
import { CreateADeveloperAccountUseCase } from "./create-a-developer-account-use-case";
import { FakeHasher } from "@/../test/cryptography/fake-hasher";

let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let fakeHasher: FakeHasher;
let sut: CreateADeveloperAccountUseCase; // sut is System Under Test

describe("Create a developer account use case", () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateADeveloperAccountUseCase(
      inMemoryDevelopersRepository,
      fakeHasher
    );
  });

  it("Should be able to create a new developer account", async () => {
    const result = await sut.execute({
      name: "Daniel",
      email: "daniel@email.com",
      password: "123456",
      bio: null,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryDevelopersRepository.items[0]).toEqual(
      expect.objectContaining({
        email: "daniel@email.com",
        password: "123456-hashed",
        bio: null,
      })
    );
  });
});
