import { Entity } from "@/core/entities/entity";

export interface DeveloperAttachmentProps {
  developerId: string;
  attachmentId: string;
}

export class DeveloperAttachment extends Entity<DeveloperAttachmentProps> {
  get developerId() {
    return this.props.developerId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: DeveloperAttachmentProps, id?: string) {
    return new DeveloperAttachment(props, id);
  }
}
