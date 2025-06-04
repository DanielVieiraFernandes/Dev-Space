import { Either, left, right } from "@/core/errors/either";
import { DeveloperNotExistError } from "./errors/developer-not-exist-error";
import { Post } from "@/domain/dev-space/enterprise/entities/post";
import { PostsRepository } from "../repositories/posts-repository";
import { DevelopersRepository } from "../repositories/developers-repository";
import { PostAttachment } from "@/domain/dev-space/enterprise/entities/post-attachment";

interface CreatePostUseCaseRequest {
  authorId: string;
  content: string;
  attachmentsIds: string[];
}

type CreatePostUseCaseResponse = Either<
  DeveloperNotExistError,
  {
    post: Post;
  }
>;

export class CreatePostUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private developersRepository: DevelopersRepository
  ) {}

  async execute({
    attachmentsIds,
    authorId,
    content,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const developer = await this.developersRepository.findById(authorId);

    if (!developer) {
      return left(new DeveloperNotExistError());
    }

    const post = Post.create({
      authorId,
      content,
    });

    const postAttachments = attachmentsIds.map((attachmentId) => {
      return PostAttachment.create({
        attachmentId,
        postId: post.id,
      });
    });

    post.attachments.update(postAttachments);

    await this.postsRepository.create(post);

    return right({
      post,
    });
  }
}
