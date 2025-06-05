import { InMemoryDevelopersRepository } from "@/../test/repositories/in-memory-developers-repository";
import { CreatePostUseCase } from "./create-post";
import { makeDeveloper } from "../../../../../test/factories/make-developer";
import { DeveloperAlreadyExistError } from "./errors/developer-already-exist-error";
import { InMemoryPostsRepository } from "../../../../../test/repositories/in-memory-posts-repository";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryDevelopersRepository: InMemoryDevelopersRepository;
let sut: CreatePostUseCase; // sut is System Under Test

describe("Create post use case", () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository();
    sut = new CreatePostUseCase(
      inMemoryPostsRepository,
      inMemoryDevelopersRepository
    );
  });

  it("Should be able to create a new post", async () => {
    inMemoryDevelopersRepository.items.push(makeDeveloper({}, "author-1"));

    const result = await sut.execute({
      authorId: "author-1",
      content: "This is a new post",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPostsRepository.items).toHaveLength(1);
    expect(inMemoryPostsRepository.items[0]).toEqual(
      expect.objectContaining({
        authorId: "author-1",
        content: "This is a new post",
      })
    );
    expect(
      inMemoryPostsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryPostsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: "1",
      }),
      expect.objectContaining({
        attachmentId: "2",
      }),
    ]);
  });

  it("Should not be able to create a new post account when the developer not exist", async () => {
    const result = await sut.execute({
      authorId: "author-1",
      content: "This is a new post",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DeveloperNotExistError);
  });
});
