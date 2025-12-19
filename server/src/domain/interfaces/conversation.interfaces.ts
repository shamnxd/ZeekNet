import { UserRole } from '../enums/user-role.enum';

export interface ConversationParticipant {
  userId: string;
  role: UserRole;
  unreadCount: number;
  lastReadAt?: Date | null;
  name: string;
  profileImage: string | null;
}

export interface LastMessageSummary {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}
