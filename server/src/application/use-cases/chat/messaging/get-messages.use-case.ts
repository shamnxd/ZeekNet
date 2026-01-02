import { IGetMessagesUseCase } from 'src/domain/interfaces/use-cases/chat/messaging/IChatUseCases';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';

export class GetMessagesUseCase implements IGetMessagesUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  async execute(userId: string, conversationId: string, page = 1, limit = 20) {
    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const isParticipant = conversation.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      throw new AuthorizationError('You are not part of this conversation');
    }

    return this._messageRepository.getByConversationId(conversationId, { page, limit });
  }
}
