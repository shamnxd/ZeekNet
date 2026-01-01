import { ChatMessage } from 'src/domain/entities/chat-message.entity';
import { ChatMessageResponseDto } from 'src/application/dtos/chat/responses/chat-message-response.dto';

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
      replyToMessage: null, 
    };
  }

  static toResponseList(messages: ChatMessage[]): ChatMessageResponseDto[] {
    return messages.map((message) => this.toResponse(message));
  }
}


