import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";
import { PostAttachmentList } from "./post-attachment-list";
import { PostAttachment } from "./post-attachment";

interface PostProps {
  authorId: string;
  content: string;
  attachments: PostAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Post extends Entity<PostProps> {
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: PostAttachmentList) {
    this.props.attachments = attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<PostProps, "createdAt" | "attachments">,
    id?: string
  ) {
    return new Post(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new PostAttachmentList([]),
      },
      id
    );
  }
}
