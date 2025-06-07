import { PostCommentsRepository } from '@/domain/dev-space/application/repositories/post-comments-repository';
import { Comment } from '@/domain/dev-space/enterprise/entities/comment';

export class InMemoryPostCommentsRepository implements PostCommentsRepository {
  items: Comment[] = [];

  async create(comment: Comment): Promise<void> {
    this.items.push(comment);
  }

  async save(comment: Comment): Promise<void> {
    const index = this.items.findIndex(item => item.id === comment.id);
    if (index > -1) {
      this.items[index] = comment;
    }
  }

  async remove(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id === id);

    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = this.items.find(item => item.id === id);
    return comment ?? null;
  }
}
