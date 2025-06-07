import {
  DeveloperAttachment,
  DeveloperAttachmentProps,
} from "@/domain/dev-space/enterprise/entities/developer-attachment";
import { fakerPT_BR } from "@faker-js/faker";

export const makeDeveloperAttachment = (
  override: Partial<DeveloperAttachmentProps> = {},
  id?: string
) => {
  return DeveloperAttachment.create(
    {
      developerId: fakerPT_BR.string.uuid(),
      attachmentId: fakerPT_BR.string.uuid(),
      ...override,
    },
    id
  );
};
