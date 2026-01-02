import { User } from 'src/domain/entities/user.entity';
import { UserResponseDto } from 'src/application/dtos/auth/verification/responses/user-response.dto';

import { UserRole } from 'src/domain/enums/user-role.enum';
import { CreateInput } from 'src/domain/types/common.types';

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

  static toEntity(data: {
    name?: string;
    email: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
    isBlocked: boolean;
    refreshToken?: string;
  }): CreateInput<User> {
    return {
      name: data.name || '',
      email: data.email,
      password: data.password,
      role: data.role,
      isVerified: data.isVerified,
      isBlocked: data.isBlocked,
      refreshToken: data.refreshToken || null,
    };
  }
}

