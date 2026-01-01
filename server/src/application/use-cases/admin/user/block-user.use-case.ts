import { INotificationService } from 'src/domain/interfaces/services/INotificationService';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';

export class BlockUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _notificationService: INotificationService,
  ) {}

  async execute(userId: string, isBlocked: boolean): Promise<void> {
    await this._userRepository.update(userId, { isBlocked });
    
    if (isBlocked) {
      this._notificationService.sendUserBlockedEvent(userId);
    }
  }
}
