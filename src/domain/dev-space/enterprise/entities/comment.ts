import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';

export interface CommentProps {
  authorId: string;
  postId: string;
  commentId?: string | null;
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

  get commentId() {
    return this.props.commentId;
  }

  set commentId(value: string | undefined | null) {
    this.props.commentId = value ?? null;
  }

  get content() {
    return this.props.content;
  }

  set content(value: string) {
    this.props.content = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CommentProps, 'createdAt' | 'commentId'>,
    id?: string
  ) {
    return new Comment(
      {
        createdAt: props.createdAt ?? new Date(),
        commentId: props.commentId ?? null,
        ...props,
      },
      id
    );
  }
}
