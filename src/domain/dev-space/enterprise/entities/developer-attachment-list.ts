import { WatchedList } from "@/core/entities/watched-list";
import { DeveloperAttachment } from "./developer-attachment";

export class DeveloperAttachmentList extends WatchedList<DeveloperAttachment> {
  compareItems(a: DeveloperAttachment, b: DeveloperAttachment): boolean {
    return a.attachmentId === b.attachmentId;
  }
}
