import { notificationService } from '../../../infrastructure/services/notification.service';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';

export class BlockUserUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string, isBlocked: boolean): Promise<void> {
    // Use thin repository update method
    await this._userRepository.update(userId, { isBlocked });
    console.log(`User ${userId} block status updated to ${isBlocked}`);
    
    if (isBlocked) {
      notificationService.sendUserBlockedEvent(userId);
    }
  }
}