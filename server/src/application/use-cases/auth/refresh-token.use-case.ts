import { LoginResponseDto } from '../../dto/auth/login-response.dto';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { IPasswordHasher } from '../../../domain/interfaces/services/IPasswordHasher';
import { IRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/IRefreshTokenUseCase';
import { AuthenticationError, NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { UserMapper } from '../../mappers/user.mapper';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _passwordHasher: IPasswordHasher,
  ) {}

  async execute(refreshToken: string): Promise<LoginResponseDto> {
    const payload = this._tokenService.verifyRefresh(refreshToken);
    const user = await this._userRepository.findById(payload.sub);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (!user.refreshToken) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const isTokenValid = await this._passwordHasher.compare(refreshToken, user.refreshToken);
    if (!isTokenValid) {
      throw new AuthenticationError('Invalid refresh token');
    }

    if (user.isBlocked) {
      throw new AuthorizationError('User account is blocked');
    }
    
    const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role });
    const newRefreshToken = this._tokenService.signRefresh({ sub: user.id });
    const hashedNewRefresh = await this._passwordHasher.hash(newRefreshToken);
    await this._userRepository.update(user.id, { refreshToken: hashedNewRefresh });

    return {
      tokens: { accessToken, refreshToken: newRefreshToken },
      user: UserMapper.toResponse(user),
    };
  }
}
