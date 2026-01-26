import { IMarkMessagesAsReadUseCase } from 'src/domain/interfaces/use-cases/chat/IMarkMessagesAsReadUseCase';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { IChatSocketService } from 'src/domain/interfaces/services/IChatSocketService';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';
import { ConversationMapper } from 'src/application/mappers/chat/conversation.mapper';
import { MarkMessagesAsReadDto } from 'src/application/dtos/chat/requests/mark-messages-as-read.dto';

export class MarkMessagesAsReadUseCase implements IMarkMessagesAsReadUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _conversationRepository: IConversationRepository,
    private readonly _chatSocketService: IChatSocketService,
  ) { }

  async execute(input: MarkMessagesAsReadDto): Promise<ConversationResponseDto> {
    const { userId, conversationId } = input;

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

    const response = ConversationMapper.toResponse(conversation);

    const otherParticipant = conversation.participants.find((p) => p.userId !== userId);
    if (otherParticipant) {
      this._chatSocketService.emitMessagesRead(conversationId, userId, otherParticipant.userId);
    }

    return response;
  }
}
