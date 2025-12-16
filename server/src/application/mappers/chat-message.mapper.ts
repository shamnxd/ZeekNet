import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { ChatMessageResponseDto } from '../dto/chat/chat-message-response.dto';

export class ChatMessageMapper {
  static toResponse(message: ChatMessage): ChatMessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.isDeleted ? 'This message was deleted' : message.content,
      status: message.status,
      isDeleted: message.isDeleted,
      createdAt: message.createdAt,
      readAt: message.readAt,
      replyToMessageId: message.replyToMessageId,
      replyToMessage: null, // Will be populated by repository if needed
    };
  }

  static toResponseList(messages: ChatMessage[]): ChatMessageResponseDto[] {
    return messages.map((message) => this.toResponse(message));
  }
}
