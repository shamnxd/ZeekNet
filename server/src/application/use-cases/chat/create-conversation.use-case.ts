import { ICreateConversationUseCase } from '../../../domain/interfaces/use-cases/chat/IChatUseCases';
import { IConversationRepository } from '../../../domain/interfaces/repositories/chat/IConversationRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ValidationError, NotFoundError } from '../../../domain/errors/errors';
import { Conversation } from '../../../domain/entities/conversation.entity';

export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(
    private readonly _conversationRepository: IConversationRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(creatorId: string, participantId: string): Promise<Conversation> {
    if (creatorId === participantId) {
      throw new ValidationError('Cannot start a conversation with yourself');
    }

    const [creator, participant] = await Promise.all([
      this._userRepository.findById(creatorId),
      this._userRepository.findById(participantId),
    ]);

    if (!creator) throw new NotFoundError('Creator not found');
    if (!participant) throw new NotFoundError('Participant not found');

    const existing = await this._conversationRepository.findByParticipants(creatorId, participantId);
    if (existing) {
      return existing;
    }

    const payload: Omit<Conversation, 'id' | '_id' | 'createdAt' | 'updatedAt'> = {
      participants: [
        { userId: creator.id, role: creator.role, unreadCount: 0, lastReadAt: null },
        { userId: participant.id, role: participant.role, unreadCount: 0, lastReadAt: null },
      ],
      lastMessage: null,
      withLastMessage: Conversation.prototype.withLastMessage,
    };

    return this._conversationRepository.create(payload);
  }
}

