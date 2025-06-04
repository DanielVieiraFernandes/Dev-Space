import { Post } from "@/domain/dev-space/enterprise/entities/post";

export abstract class PostsRepository {
  abstract create(post: Post): Promise<void>;
}
