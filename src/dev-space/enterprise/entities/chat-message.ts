import { Entity } from "@/core/entities/entity";

interface ChatMessageProps {
  authorId: string;
  content: string;
  timestamp: Date;
}

export class ChatMessage extends Entity<ChatMessageProps> {
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  get timestamp() {
    return this.props.timestamp;
  }
}
