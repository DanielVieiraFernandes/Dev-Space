import { PostAttachmentsRepository } from "@/domain/dev-space/application/repositories/post-attachments-repository";
import { PostAttachment } from "@/domain/dev-space/enterprise/entities/post-attachment";

export class InMemoryPostAttachmentsRepository
  implements PostAttachmentsRepository
{
  items: PostAttachment[] = [];

  async findManyByPostId(
    postId: string
  ): Promise<PostAttachment[]> {
    const postAttachments = this.items.filter(
      (attachment) => attachment.postId === postId
    );

    return postAttachments;
  }

  async deleteManyByPostId(postId: string): Promise<void> {
    this.items = this.items.filter(
      (attachment) => attachment.postId !== postId
    );
  }
}
