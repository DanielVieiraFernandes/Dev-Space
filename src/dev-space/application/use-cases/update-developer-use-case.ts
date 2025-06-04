import { Either, left, right } from "@/core/errors/either";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";
import { DevelopersRepository } from "../repositories/developers-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface UpdateDeveloperUseCaseRequest {
  userId: string;
  password: string;
  name?: string | null;
  email?: string | null;
  bio?: string | null;
}

type UpdateDeveloperUseCaseResponse = Either<
  DeveloperNotExistError | WrongCredentialsError,
  {}
>;

export class UpdateDeveloperUseCase {
  constructor(
    private developersRepository: DevelopersRepository,
    private hashComparer: HashComparer
  ) {}

  async execute({
    userId,
    password,
    bio,
    email,
    name,
  }: UpdateDeveloperUseCaseRequest): Promise<UpdateDeveloperUseCaseResponse> {
    const developer = await this.developersRepository.findById(userId);

    if (!developer) {
      return left(new DeveloperNotExistError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      developer.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    developer.name = name ?? developer.name;
    developer.email = email ?? developer.email;
    developer.bio = bio ?? developer.bio;

    await this.developersRepository.save(developer);

    return right({});
  }
}
