export interface ConversationParticipantDto {
  userId: string;
  role: string;
  unreadCount: number;
  lastReadAt?: Date | null;
  name: string;
  profileImage: string | null;
}

export interface LastMessageDto {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export interface ConversationResponseDto {
  id: string;
  participants: ConversationParticipantDto[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: LastMessageDto | null;
}

