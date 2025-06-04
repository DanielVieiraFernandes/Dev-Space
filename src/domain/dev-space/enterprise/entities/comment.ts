import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";

interface CommentProps {
  authorId: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Comment extends Entity<CommentProps> {
  get authorId() {
    return this.props.authorId;
  }

  get postId() {
    return this.props.postId;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<CommentProps, "createdAt">, id?: string) {
    return new Comment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id
    );
  }
}
