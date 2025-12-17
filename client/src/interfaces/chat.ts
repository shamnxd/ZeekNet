export interface ConversationParticipantDto {
  userId: string;
  role: string;
  unreadCount: number;
  lastReadAt?: string | null;
  name: string;
  profileImage: string | null;
}

export interface LastMessageDto {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ConversationResponseDto {
  id: string;
  participants: ConversationParticipantDto[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: LastMessageDto | null;
}

export interface ChatMessageResponseDto {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  receiverId: string;
  status: 'sent' | 'delivered' | 'read';
  isDeleted: boolean;
  createdAt: string;
  readAt?: string | null;
  replyToMessageId?: string | null;
  replyToMessage?: {
    id: string;
    content: string;
    senderId: string;
  } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
