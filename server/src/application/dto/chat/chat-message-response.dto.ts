export interface ChatMessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: string;
  createdAt: Date;
  readAt?: Date | null;
  replyToMessageId?: string | null;
  replyToMessage?: {
    id: string;
    content: string;
    senderId: string;
  } | null;
}
