import { IGetConversationsUseCase } from 'src/domain/interfaces/use-cases/chat/IGetConversationsUseCase';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { NotFoundError } from 'src/domain/errors/errors';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { PaginatedConversationsResponseDto } from 'src/application/dtos/chat/responses/paginated-conversations-response.dto';
import { ConversationMapper } from 'src/application/mappers/chat/conversation.mapper';
import { GetConversationsDto } from 'src/application/dtos/chat/requests/get-conversations.dto';

export class GetConversationsUseCase implements IGetConversationsUseCase {
  constructor(
    private readonly _conversationRepository: IConversationRepository,
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(input: GetConversationsDto): Promise<PaginatedConversationsResponseDto> {
    const { userId, page, limit } = input;

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const result = await this._conversationRepository.getUserConversations(userId, { page, limit });

    return {
      data: ConversationMapper.toResponseList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
