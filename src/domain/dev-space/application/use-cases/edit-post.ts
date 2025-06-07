import { Either, left, right } from '@/core/errors/either';
import { PostAttachment } from '../../enterprise/entities/post-attachment';
import { PostAttachmentList } from '../../enterprise/entities/post-attachment-list';
import { DevelopersRepository } from '../repositories/developers-repository';
import { PostAttachmentsRepository } from '../repositories/post-attachments-repository';
import { PostsRepository } from '../repositories/posts-repository';
import { DeveloperNotExistError } from './errors/developer-not-exist-error';
import { UnAuthorizedError } from './errors/unauthorized-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface EditPostUseCaseRequest {
  authorId: string;
  postId: string;
  content?: string | null;
  attachmentsIds?: string[] | null;
}

type EditPostUseCaseResponse = Either<
  DeveloperNotExistError | WrongCredentialsError | UnAuthorizedError,
  { success?: boolean }
>;

export class EditPostUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private postAttachmentsRepository: PostAttachmentsRepository,
    private developersRepository: DevelopersRepository
  ) {}

  async execute({
    authorId,
    postId,
    content,
    attachmentsIds,
  }: EditPostUseCaseRequest): Promise<EditPostUseCaseResponse> {
    const author = await this.developersRepository.findById(authorId);

    if (!author) {
      return left(new DeveloperNotExistError());
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new WrongCredentialsError());
    }

    if (post.authorId !== authorId) {
      return left(new UnAuthorizedError());
    }

    if (attachmentsIds) {
      const currentAttachments =
        await this.postAttachmentsRepository.findManyByPostId(postId);
      const postAttachmentList = new PostAttachmentList(currentAttachments);
      const attachments = attachmentsIds.map(attachmentId => {
        return PostAttachment.create({
          attachmentId,
          postId,
        });
      });

      postAttachmentList.update(attachments);

      post.attachments = postAttachmentList;
    }

    post.content = content ?? post.content;

    await this.postsRepository.save(post);

    return right({
      success: true,
    });
  }
}
