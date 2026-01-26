import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';
import { IGetAllUsersUseCase } from 'src/domain/interfaces/use-cases/admin/user/IGetAllUsersUseCase';
import { GetUsersQueryDto } from 'src/application/dtos/admin/user/requests/get-users-query.dto';
import { PaginatedUsersResultDto } from 'src/application/dtos/admin/user/responses/paginated-users-result.dto';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: S3Service,
  ) { }

  async execute(options: GetUsersQueryDto): Promise<PaginatedUsersResultDto> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const criteria: Record<string, unknown> = {};
    if (options.role) {
      criteria.role = options.role as UserRole;
    }
    if (options.isBlocked !== undefined) {
      criteria.isBlocked = options.isBlocked;
    }

    let users = await this._userRepository.findMany(criteria);

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower),
      );
    }

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    const userResponses = await Promise.all(paginatedUsers.map(async (user) => {
      const response = UserMapper.toResponse(user);

      if (user.role === UserRole.SEEKER) {
        const profile = await this._seekerProfileRepository.findOne({ userId: user.id });
        if (profile && profile.avatarFileName) {
          response.avatar = await this._s3Service.getSignedUrl(profile.avatarFileName);
        }
      }

      return response;
    }));

    return {
      users: userResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

