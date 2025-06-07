import { Post, PostProps } from "@/domain/dev-space/enterprise/entities/post";
import { fakerPT_BR } from "@faker-js/faker";

export const makePost = (override: Partial<PostProps> = {}, id?: string) => {
  return Post.create(
    {
      authorId: fakerPT_BR.string.uuid(),
      content: fakerPT_BR.lorem.paragraph(),
      ...override,
    },
    id
  );
};
