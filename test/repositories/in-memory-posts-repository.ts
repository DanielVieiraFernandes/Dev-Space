import { PaginationParams } from '@/core/params/pagination-params';
import { PostsRepository } from '@/domain/dev-space/application/repositories/posts-repository';
import { Post } from '@/domain/dev-space/enterprise/entities/post';

export class InMemoryPostsRepository implements PostsRepository {
  items: Post[] = [];

  async create(post: Post): Promise<void> {
    this.items.push(post);
  }

  async save(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === post.id);
    if (itemIndex > -1) {
      this.items[itemIndex] = post;
    }
  }

  async remove(id: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === id);

    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
    }
  }

  async findMany({ page, size, search }: PaginationParams): Promise<Post[]> {
    let posts: Post[];

    if (search) {
      posts = this.items
        .filter(post =>
          post.content.toLowerCase().includes(search.toLowerCase())
        )
        .slice((page - 1) * size, page * size);
    } else {
      posts = this.items.slice((page - 1) * size, page * size);
    }

    return posts;
  }

  async findById(id: string): Promise<Post | null> {
    const post = this.items.find(item => item.id === id);
    return post ?? null;
  }
}
