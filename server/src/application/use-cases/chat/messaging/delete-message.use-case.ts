import { IDeleteMessageUseCase } from 'src/domain/interfaces/use-cases/chat/messaging/IChatUseCases';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { ChatMessage } from 'src/domain/entities/chat-message.entity';

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  async execute(userId: string, messageId: string): Promise<ChatMessage | null> {
    const message = await this._messageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new Error('You can only delete your own messages');
    }

    const deletedMessage = await this._messageRepository.deleteMessage(messageId);
    
    if (deletedMessage) {
      
      const conversation = await this._conversationRepository.findById(deletedMessage.conversationId);
      if (conversation && conversation.lastMessage && conversation.lastMessage.messageId === messageId) {
        await this._conversationRepository.updateLastMessageContent(
          conversation.id,
          messageId,
          'This message was deleted',
        );
      }
    }

    return deletedMessage;
  }
}
