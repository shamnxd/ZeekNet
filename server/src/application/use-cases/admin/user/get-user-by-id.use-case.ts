import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IAdminGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/admin/user/IAdminGetUserByIdUseCase';
import { IGetSeekerProfileUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/info/IGetSeekerProfileUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { UserResponseDto } from 'src/application/dtos/auth/user/user-response.dto';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { UserRole } from 'src/domain/enums/user-role.enum';

export class GetUserByIdUseCase implements IAdminGetUserByIdUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _getSeekerProfileUseCase: IGetSeekerProfileUseCase,
  ) { }

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const response = UserMapper.toResponse(user);

    if (user.role === UserRole.SEEKER) {
      try {
        const profile = await this._getSeekerProfileUseCase.execute(userId);
        response.seekerProfile = profile;
        response.avatar = profile.avatarUrl || undefined;
      } catch (error) {
        // If profile fetch fails, we still return the user info
        console.error('Error fetching seeker profile in GetUserByIdUseCase:', error);
      }
    }

    return response;
  }
}
