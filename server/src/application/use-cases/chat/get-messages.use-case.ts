import { IGetMessagesUseCase } from 'src/domain/interfaces/use-cases/chat/IGetMessagesUseCase';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { PaginatedMessagesResponseDto } from 'src/application/dtos/chat/responses/paginated-messages-response.dto';
import { ChatMessageMapper } from 'src/application/mappers/chat/chat-message.mapper';
import { GetMessagesDto } from 'src/application/dtos/chat/requests/get-messages.dto';

export class GetMessagesUseCase implements IGetMessagesUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _conversationRepository: IConversationRepository,
  ) { }

  async execute(input: GetMessagesDto): Promise<PaginatedMessagesResponseDto> {
    const { userId, conversationId, page, limit } = input;

    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const isParticipant = conversation.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      throw new AuthorizationError('You are not part of this conversation');
    }

    const result = await this._messageRepository.getByConversationId(conversationId, { page, limit });

    return {
      data: ChatMessageMapper.toResponseList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
