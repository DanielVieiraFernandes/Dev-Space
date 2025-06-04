import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";

interface PostProps {
  authorId: string;
  content: string;
  imageUrl: string;
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

  get imageUrl() {
    return this.props.imageUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<PostProps, "createdAt">, id?: string) {
    return new Post({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }
}
