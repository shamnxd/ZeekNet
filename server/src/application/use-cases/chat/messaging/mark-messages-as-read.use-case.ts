import { IMarkMessagesAsReadUseCase } from 'src/domain/interfaces/use-cases/chat/messaging/IChatUseCases';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';

export class MarkMessagesAsReadUseCase implements IMarkMessagesAsReadUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  async execute(userId: string, conversationId: string): Promise<void> {
    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const participantIds = conversation.participants.map((p) => p.userId);
    if (!participantIds.includes(userId)) {
      throw new AuthorizationError('You are not part of this conversation');
    }

    await this._messageRepository.markAsRead(conversationId, userId);
    await this._conversationRepository.resetUnread(conversationId, userId);
  }
}

