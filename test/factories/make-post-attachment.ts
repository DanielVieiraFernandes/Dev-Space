import {
  PostAttachment,
  PostAttachmentProps,
} from "@/domain/dev-space/enterprise/entities/post-attachment";
import { fakerPT_BR } from "@faker-js/faker";

export const makePostAttachment = (
  override: Partial<PostAttachmentProps> = {},
  id?: string
) => {
  return PostAttachment.create(
    {
      postId: fakerPT_BR.string.uuid(),
      attachmentId: fakerPT_BR.string.uuid(),
      ...override,
    },
    id
  );
};
