import { LoginResponseDto } from 'src/application/dtos/auth/session/login-response.dto';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { IRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/session/IRefreshTokenUseCase';
import { AuthenticationError, NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.TokenService) private readonly _tokenService: ITokenService,
    @inject(TYPES.PasswordHasher) private readonly _passwordHasher: IPasswordHasher,
  ) { }


  async execute(refreshToken: string): Promise<LoginResponseDto> {
    const payload = this._tokenService.verifyRefresh(refreshToken);
    const user = await this._userRepository.findById(payload.sub);
    if (!user) {
      throw new NotFoundError(ERROR.NOT_FOUND('User'));
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


