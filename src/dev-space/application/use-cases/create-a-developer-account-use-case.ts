import { Either, left, right } from "@/core/errors/either";
import { DevelopersRepository } from "../repositories/developers-repository";
import { Developer } from "@/dev-space/enterprise/entities/developer";
import { DeveloperAlreadyExistError } from "./errors/developer-already-exist-error";
import { HashGenerator } from "../cryptography/hash-generator";

interface CreateADeveloperAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
  bio: string | null;
}

type CreateADeveloperAccountUseCaseResponse = Either<
  DeveloperAlreadyExistError,
  {}
>;

export class CreateADeveloperAccountUseCase {
  constructor(
    private developersRepository: DevelopersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(
    request: CreateADeveloperAccountUseCaseRequest
  ): Promise<CreateADeveloperAccountUseCaseResponse> {
    const isDeveloperExist = await this.developersRepository.findByEmail(
      request.email
    );

    if (isDeveloperExist) {
      return left(new DeveloperAlreadyExistError());
    }

    const developer = Developer.create({
      ...request,
      password: await this.hashGenerator.generate(request.password),
    });

    await this.developersRepository.create(developer);

    return right({});
  }
}
