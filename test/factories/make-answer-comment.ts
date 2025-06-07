import {
  Comment,
  CommentProps,
} from '@/domain/dev-space/enterprise/entities/comment';
import { fakerPT_BR } from '@faker-js/faker';

export const makeAnswerComment = (
  override: Partial<CommentProps> = {},
  id?: string
) => {
  return Comment.create(
    {
      commentId: fakerPT_BR.string.uuid(),
      authorId: fakerPT_BR.string.uuid(),
      content: fakerPT_BR.lorem.paragraph(),
      postId: fakerPT_BR.string.uuid(),
      ...override,
    },
    id
  );
};
