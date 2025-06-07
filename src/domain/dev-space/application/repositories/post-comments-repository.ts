import { Comment } from '../../enterprise/entities/comment';

export abstract class PostCommentsRepository {
  abstract create(comment: Comment): Promise<void>;
  abstract save(comment: Comment): Promise<void>;
  abstract remove(id: string): Promise<void>;
  abstract findById(id: string): Promise<Comment | null>;
}
