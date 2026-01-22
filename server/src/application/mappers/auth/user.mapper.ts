import { User } from 'src/domain/entities/user.entity';
import { UserResponseDto } from 'src/application/dtos/auth/user/user-response.dto';

import { UserRole } from 'src/domain/enums/user-role.enum';
import { CreateInput } from 'src/domain/types/common.types';
import { RegisterRequestDto } from 'src/application/dtos/auth/registration/register.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static fromGoogleProfile(
    profile: { name: string; email: string; emailVerified: boolean },
    hashedPassword: string
  ): CreateInput<User> {
    return {
      name: profile.name || '',
      email: profile.email,
      password: hashedPassword,
      role: UserRole.SEEKER,
      isVerified: profile.emailVerified,
      isBlocked: false,
      refreshToken: null,
    };
  }

  static fromRegistration(
    data: RegisterRequestDto,
    hashedPassword: string
  ): CreateInput<User> {
    return {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.SEEKER,
      isVerified: false,
      isBlocked: false,
      refreshToken: null,
    };
  }
}

