import { ICreateConversationUseCase } from 'src/domain/interfaces/use-cases/chat/ICreateConversationUseCase';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ValidationError, NotFoundError } from 'src/domain/errors/errors';
import { Conversation } from 'src/domain/entities/conversation.entity';
import { CreateInput } from 'src/domain/types/common.types';
import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';
import { ConversationMapper } from 'src/application/mappers/chat/conversation.mapper';
import { CreateConversationDto } from 'src/application/dtos/chat/requests/create-conversation.dto';

export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(
    private readonly _conversationRepository: IConversationRepository,
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(input: CreateConversationDto): Promise<ConversationResponseDto> {
    const { creatorId, participantId } = input;

    if (creatorId === participantId) {
      throw new ValidationError('Cannot start a conversation with yourself');
    }

    const [creator, participant] = await Promise.all([
      this._userRepository.findById(creatorId),
      this._userRepository.findById(participantId),
    ]);

    if (!creator) throw new NotFoundError('Creator not found');
    if (!participant) throw new NotFoundError('Participant not found');

    if (creator.isBlocked) {
      throw new ValidationError('Your account has been blocked. You cannot start conversations.');
    }

    if (participant.isBlocked) {
      throw new ValidationError('Cannot start conversation with this user');
    }

    const existing = await this._conversationRepository.findByParticipants(creatorId, participantId);
    if (existing) {
      return ConversationMapper.toResponse(existing);
    }

    const payload: CreateInput<Conversation> = {
      participants: [
        { userId: creator.id, role: creator.role, unreadCount: 0, lastReadAt: null, name: creator.name, profileImage: null },
        { userId: participant.id, role: participant.role, unreadCount: 0, lastReadAt: null, name: participant.name, profileImage: null },
      ],
      lastMessage: null,
      withLastMessage: Conversation.prototype.withLastMessage,
    };

    const newConversation = await this._conversationRepository.create(payload);
    return ConversationMapper.toResponse(newConversation);
  }
}
