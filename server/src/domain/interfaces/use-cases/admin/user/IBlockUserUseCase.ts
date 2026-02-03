import { BlockUserRequestDto } from 'src/application/dtos/admin/user/requests/block-user-request.dto';

export interface IBlockUserUseCase {
  execute(params: BlockUserRequestDto): Promise<void>;
}
