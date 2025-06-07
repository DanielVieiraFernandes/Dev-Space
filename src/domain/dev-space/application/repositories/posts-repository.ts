import { PaginationParams } from "@/core/params/pagination-params";
import { Post } from "@/domain/dev-space/enterprise/entities/post";

export abstract class PostsRepository {
  abstract create(post: Post): Promise<void>;
  abstract save(post: Post): Promise<void>;
  abstract remove(id: string): Promise<void>;
  abstract findMany(params: PaginationParams): Promise<Post[]>;
  abstract findById(id: string): Promise<Post | null>;
}
