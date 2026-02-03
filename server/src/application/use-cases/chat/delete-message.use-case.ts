import { IDeleteMessageUseCase } from 'src/domain/interfaces/use-cases/chat/IDeleteMessageUseCase';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { IChatSocketService } from 'src/domain/interfaces/services/IChatSocketService';
import { Conversation } from 'src/domain/entities/conversation.entity';
import { DeleteMessageResponseDto } from 'src/application/dtos/chat/responses/delete-message-response.dto';
import { ConversationMapper } from 'src/application/mappers/chat/conversation.mapper';
import { ChatMessageMapper } from 'src/application/mappers/chat/chat-message.mapper';
import { DeleteMessageDto } from 'src/application/dtos/chat/requests/delete-message.dto';

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _conversationRepository: IConversationRepository,
    private readonly _chatSocketService: IChatSocketService,
  ) { }

  async execute(input: DeleteMessageDto): Promise<DeleteMessageResponseDto | null> {
    const { userId, messageId } = input;

    const message = await this._messageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new Error('You can only delete your own messages');
    }

    const deletedMessage = await this._messageRepository.deleteMessage(messageId);
    let conversation: Conversation | null = null;

    if (deletedMessage) {
      conversation = await this._conversationRepository.findById(deletedMessage.conversationId);
      if (conversation && conversation.lastMessage && conversation.lastMessage.messageId === messageId) {
        await this._conversationRepository.updateLastMessageContent(
          conversation.id,
          messageId,
          'This message was deleted',
        );
      }
    }

    if (!deletedMessage) return null;

    const response = {
      message: ChatMessageMapper.toResponse(deletedMessage),
      conversation: conversation ? ConversationMapper.toResponse(conversation) : null,
    };

    if (response.conversation) {
      this._chatSocketService.emitMessageDeleted(response.message, response.conversation);
    }

    return response;
  }
}
