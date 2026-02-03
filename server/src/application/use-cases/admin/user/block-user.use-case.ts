import { IBlockUserUseCase } from 'src/domain/interfaces/use-cases/admin/user/IBlockUserUseCase';
import { INotificationService } from 'src/domain/interfaces/services/INotificationService';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { BlockUserRequestDto } from 'src/application/dtos/admin/user/requests/block-user-request.dto';

export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _notificationService: INotificationService,
  ) { }

  async execute(params: BlockUserRequestDto): Promise<void> {
    await this._userRepository.update(params.userId, { isBlocked: params.isBlocked });

    if (params.isBlocked) {
      this._notificationService.sendUserBlockedEvent(params.userId);
    }
  }
}
