import { LoginResponseDto } from 'src/application/dtos/auth/session/responses/login-response.dto';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { IAdminLoginUseCase } from 'src/domain/interfaces/use-cases/auth/session/IAdminLoginUseCase';
import { AuthenticationError, AuthorizationError } from 'src/domain/errors/errors';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (user.isBlocked) {
      throw new AuthorizationError('User is blocked');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new AuthorizationError('Not authorized as admin');
    }

    const isPasswordValid = await this._passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role });
    const refreshToken = this._tokenService.signRefresh({ sub: user.id });
    const hashedRefresh = await this._passwordHasher.hash(refreshToken);
    await this._userRepository.update(user.id, { refreshToken: hashedRefresh });

    return {
      tokens: { accessToken, refreshToken },
      user: UserMapper.toResponse(user),
    };
  }
}


