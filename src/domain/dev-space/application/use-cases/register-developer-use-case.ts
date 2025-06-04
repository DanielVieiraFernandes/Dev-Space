import { Either, left, right } from "@/core/errors/either";
import { DevelopersRepository } from "../repositories/developers-repository";
import { Developer } from "@/domain/dev-space/enterprise/entities/developer";
import { DeveloperAlreadyExistError } from "./errors/developer-already-exist-error";
import { HashGenerator } from "../cryptography/hash-generator";
import { DeveloperAttachmentList } from "@/domain/dev-space/enterprise/entities/developer-attachment-list";
import { DeveloperAttachment } from "@/domain/dev-space/enterprise/entities/developer-attachment";

interface RegisterDeveloperUseCaseRequest {
  name: string;
  email: string;
  password: string;
  bio: string | null;
  attachmentsIds: string[];
}

type RegisterDeveloperUseCaseResponse = Either<DeveloperAlreadyExistError, {}>;

export class RegisterDeveloperUseCase {
  constructor(
    private developersRepository: DevelopersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(
    request: RegisterDeveloperUseCaseRequest
  ): Promise<RegisterDeveloperUseCaseResponse> {
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

    const developerAttachments = request.attachmentsIds.map((attachment) => {
      return DeveloperAttachment.create({
        attachmentId: attachment,
        developerId: developer.id,
      });
    });
    developer.attachments.update(developerAttachments);

    await this.developersRepository.create(developer);

    return right({});
  }
}
