import { Either, left, right } from "@/core/errors/either";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";
import { DevelopersRepository } from "../repositories/developers-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { DeveloperAttachmentsRepository } from "../repositories/developer-attachments-repository";
import { DeveloperAttachmentList } from "@/dev-space/enterprise/entities/developer-attachment-list";
import { DeveloperAttachment } from "@/dev-space/enterprise/entities/developer-attachment";

interface UpdateDeveloperUseCaseRequest {
  userId: string;
  password: string;
  attachmentsIds: string[];
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
    private developerAttachmentsRepository: DeveloperAttachmentsRepository,
    private hashComparer: HashComparer
  ) {}

  async execute({
    userId,
    attachmentsIds,
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

    const currentAttachments =
      await this.developerAttachmentsRepository.findManyByDeveloperId(developer.id);
    const developerAttachmentList = new DeveloperAttachmentList(
      currentAttachments
    );
    const developerAttachments = attachmentsIds.map((attachmentId) => {
      return DeveloperAttachment.create({
        attachmentId,
        developerId: developer.id,
      });
    });

    developerAttachmentList.update(developerAttachments);

    developer.attachments = developerAttachmentList;
    developer.name = name ?? developer.name;
    developer.email = email ?? developer.email;
    developer.bio = bio ?? developer.bio;

    await this.developersRepository.save(developer);

    return right({});
  }
}
