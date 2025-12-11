import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IGetAllUsersUseCase } from 'src/domain/interfaces/use-cases/admin/IGetAllUsersUseCase';
import { GetUsersQueryDto } from '../../dto/seeker/get-users-query.dto';
import { PaginatedUsersResultDto } from '../../dto/seeker/paginated-users-result.dto';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { User } from '../../../domain/entities/user.entity';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

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

    return {
      users: paginatedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
