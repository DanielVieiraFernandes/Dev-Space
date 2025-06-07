import { Entity } from "@/core/entities/entity";

interface AtachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AtachmentProps> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }

  static create(props: AtachmentProps, id?: string) {
    return new Attachment(props, id);
  }
}
