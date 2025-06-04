import { Entity } from "@/core/entities/entity";

export interface PostAttachmentProps {
  postId: string;
  attachmentId: string;
}

export class PostAttachment extends Entity<PostAttachmentProps> {
  get postId() {
    return this.props.postId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: PostAttachmentProps, id?: string) {
    return new PostAttachment(props, id);
  }
}
