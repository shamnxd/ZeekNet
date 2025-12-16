import { IGetConversationsUseCase } from '../../../domain/interfaces/use-cases/chat/IChatUseCases';
import { IConversationRepository } from '../../../domain/interfaces/repositories/chat/IConversationRepository';
import { NotFoundError } from '../../../domain/errors/errors';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';

export class GetConversationsUseCase implements IGetConversationsUseCase {
  constructor(
    private readonly _conversationRepository: IConversationRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string, page = 1, limit = 20) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this._conversationRepository.getUserConversations(userId, { page, limit });
  }
}

