import { IBlockUserUseCase } from 'src/domain/interfaces/use-cases/admin/user/IBlockUserUseCase';
import { INotificationService } from 'src/domain/interfaces/services/INotificationService';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { BlockUserRequestDto } from 'src/application/dtos/admin/user/requests/block-user-request.dto';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,
  ) { }

  async execute(params: BlockUserRequestDto): Promise<void> {
    await this._userRepository.update(params.userId, { isBlocked: params.isBlocked });

    if (params.isBlocked) {
      this._notificationService.sendUserBlockedEvent(params.userId);
    }
  }
}
