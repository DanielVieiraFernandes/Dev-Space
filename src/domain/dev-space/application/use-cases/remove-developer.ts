import { Either, left, right } from "@/core/errors/either";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";
import { DevelopersRepository } from "../repositories/developers-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { HashComparer } from "../cryptography/hash-comparer";

interface RemoveDeveloperUseCaseRequest {
  developerId: string;
  password: string;
}

type RemoveDeveloperUseCaseResponse = Either<
  DeveloperNotExistError | WrongCredentialsError,
  {}
>;

export class RemoveDeveloperUseCase {
  constructor(
    private developersRepository: DevelopersRepository,
    private hashComparer: HashComparer
  ) {}

  async execute({
    developerId,
    password,
  }: RemoveDeveloperUseCaseRequest): Promise<RemoveDeveloperUseCaseResponse> {
    const developer = await this.developersRepository.findById(developerId);

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
    await this.developersRepository.remove(developer.id);

    return right({});
  }
}
