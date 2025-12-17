export enum MessageStatus {
  SENT = 'sent',
  READ = 'read',
}

export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly content: string,
    public readonly status: MessageStatus,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly readAt?: Date | null,
    public readonly replyToMessageId?: string | null,
  ) {}

  static create(data: {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    status?: MessageStatus;
    isDeleted?: boolean;
    createdAt?: Date;
    readAt?: Date | null;
    replyToMessageId?: string | null;
  }): ChatMessage {
    const now = new Date();
    return new ChatMessage(
      data.id,
      data.conversationId,
      data.senderId,
      data.receiverId,
      data.content,
      data.status ?? MessageStatus.SENT,
      data.isDeleted ?? false,
      data.createdAt ?? now,
      data.readAt ?? null,
      data.replyToMessageId ?? null,
    );
  }
}

