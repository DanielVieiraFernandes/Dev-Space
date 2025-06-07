import { WatchedList } from "@/core/entities/watched-list";
import { PostAttachment } from "./post-attachment";

export class PostAttachmentList extends WatchedList<PostAttachment> {
  compareItems(a: PostAttachment, b: PostAttachment): boolean {
    return a.attachmentId === b.attachmentId;
  }
}
