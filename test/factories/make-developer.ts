import {
  Developer,
  DeveloperProps,
} from "@/domain/dev-space/enterprise/entities/developer";
import { DeveloperAttachmentList } from "@/domain/dev-space/enterprise/entities/developer-attachment-list";
import { fakerPT_BR } from "@faker-js/faker";

export const makeDeveloper = (
  override: Partial<DeveloperProps>,
  id?: string
) => {
  return Developer.create(
    {
      name: fakerPT_BR.person.fullName(),
      email: fakerPT_BR.internet.email(),
      bio: fakerPT_BR.person.bio(),
      password: fakerPT_BR.internet.password() + "-hashed",
      attachments: new DeveloperAttachmentList(),
      ...override,
    },
    id
  );
};
