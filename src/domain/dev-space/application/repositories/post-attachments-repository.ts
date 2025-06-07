import { PostAttachment } from "@/domain/dev-space/enterprise/entities/post-attachment";

export abstract class PostAttachmentsRepository {
  abstract findManyByPostId(postId: string): Promise<PostAttachment[]>;
}
