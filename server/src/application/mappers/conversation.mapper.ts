import { Conversation } from '../../domain/entities/conversation.entity';
import { ConversationResponseDto } from '../dto/chat/conversation-response.dto';

export class ConversationMapper {
  static toResponse(conversation: Conversation): ConversationResponseDto {
    return {
      id: conversation.id,
      participants: conversation.participants.map((participant) => ({
        userId: participant.userId,
        role: participant.role,
        unreadCount: participant.unreadCount,
        lastReadAt: participant.lastReadAt,
      })),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      lastMessage: conversation.lastMessage
        ? {
          messageId: conversation.lastMessage.messageId,
          senderId: conversation.lastMessage.senderId,
          content: conversation.lastMessage.content,
          createdAt: conversation.lastMessage.createdAt,
        }
        : null,
    };
  }

  static toResponseList(conversations: Conversation[]): ConversationResponseDto[] {
    return conversations.map((conversation) => this.toResponse(conversation));
  }
}

