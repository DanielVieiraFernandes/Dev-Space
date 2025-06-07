import { PaginationParams } from '@/core/params/pagination-params';
import { AnswerCommentsRepository } from '@/domain/dev-space/application/repositories/answer-comments-repository';
import { Comment } from '@/domain/dev-space/enterprise/entities/comment';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
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

  async findMany({ page, size, search }: PaginationParams): Promise<Comment[]> {
    let comments;

    if (search) {
      comments = this.items
        .filter(item =>
          item.content.toLowerCase().includes(search.toLocaleLowerCase())
        )
        .slice((page - 1) * size, page * size);
    } else {
      comments = this.items.slice((page - 1) * size, page * size);
    }

    return comments;
  }
}
