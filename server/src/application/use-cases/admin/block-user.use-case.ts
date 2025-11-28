import { notificationService } from '../../../infrastructure/di/notificationDi';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';

export class BlockUserUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string, isBlocked: boolean): Promise<void> {
    await this._userRepository.update(userId, { isBlocked });
    console.log(`User ${userId} block status updated to ${isBlocked}`);
    
    if (isBlocked) {
      notificationService.sendUserBlockedEvent(userId);
    }
  }
}
