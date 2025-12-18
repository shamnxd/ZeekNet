import { ChatMessage } from './chat-message.entity';
import { ConversationParticipant, LastMessageSummary } from '../interfaces/conversation.interfaces';


export class Conversation {
  constructor(
    public readonly id: string,
    public readonly participants: ConversationParticipant[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly lastMessage?: LastMessageSummary | null,
  ) {}

  static create(data: {
    id: string;
    participants: ConversationParticipant[];
    createdAt?: Date;
    updatedAt?: Date;
    lastMessage?: LastMessageSummary | null;
  }): Conversation {
    const now = new Date();
    return new Conversation(
      data.id,
      data.participants,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.lastMessage ?? null,
    );
  }

  withLastMessage(message: ChatMessage): Conversation {
    return new Conversation(this.id, this.participants, this.createdAt, message.createdAt, {
      messageId: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    });
  }
}

