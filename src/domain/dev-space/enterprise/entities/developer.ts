import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";
import { DeveloperAttachmentList } from "./developer-attachment-list";
import { DeveloperAttachment } from "./developer-attachment";

export interface DeveloperProps {
  name: string;
  email: string;
  password: string;
  bio: string | null;
  attachments: DeveloperAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Developer extends Entity<DeveloperProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get bio(): string | null {
    return this.props.bio;
  }

  set bio(bio: string | null) {
    this.props.bio = bio;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: DeveloperAttachmentList) {
    this.props.attachments = attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<DeveloperProps, "createdAt" | "bio" | "attachments">,
    id?: string
  ) {
    return new Developer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        bio: props.bio ?? null,
        attachments:
          props.attachments ??
          new DeveloperAttachmentList([]),
      },
      id
    );
  }
}
