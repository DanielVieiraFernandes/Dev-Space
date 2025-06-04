import { DeveloperAttachment } from "@/dev-space/enterprise/entities/developer-attachment";

export abstract class DeveloperAttachmentsRepository {
  abstract findManyByDeveloperId(
    developerId: string
  ): Promise<DeveloperAttachment[]>;
  abstract deleteManyByDeveloperId(developerId: string): Promise<void>;
}
