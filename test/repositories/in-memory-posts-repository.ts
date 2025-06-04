import { PostsRepository } from "@/domain/dev-space/application/repositories/posts-repository";
import { Post } from "@/domain/dev-space/enterprise/entities/post";

export class InMemoryPostsRepository implements PostsRepository {
  items: Post[] = [];

  async create(post: Post): Promise<void> {
    this.items.push(post);
  }
}
