import { DeveloperAttachmentsRepository } from "@/domain/dev-space/application/repositories/developer-attachments-repository";
import { DevelopersRepository } from "@/domain/dev-space/application/repositories/developers-repository";
import { Attachment } from "@/domain/dev-space/enterprise/entities/attachment";
import { Developer } from "@/domain/dev-space/enterprise/entities/developer";
import { DeveloperAttachment } from "@/domain/dev-space/enterprise/entities/developer-attachment";

export class InMemoryDeveloperAttachmentsRepository
  implements DeveloperAttachmentsRepository
{
  items: DeveloperAttachment[] = [];

  async findManyByDeveloperId(
    developerId: string
  ): Promise<DeveloperAttachment[]> {
    const developerAttachments = this.items.filter(
      (attachment) => attachment.developerId === developerId
    );

    return developerAttachments;
  }

  async deleteManyByDeveloperId(developerId: string): Promise<void> {
    this.items = this.items.filter(
      (attachment) => attachment.developerId !== developerId
    );
  }
}
