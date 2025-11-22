import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { UserQueryOptions, PaginatedUsers, IGetAllUsersUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { User } from '../../../domain/entities/user.entity';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(options: UserQueryOptions): Promise<PaginatedUsers> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    // Build query criteria
    const criteria: Record<string, unknown> = {};
    if (options.role) {
      criteria.role = options.role as UserRole;
    }
    if (options.isBlocked !== undefined) {
      criteria.isBlocked = options.isBlocked;
    }

    // Get users using thin repository (search/pagination logic moved to use case)
    // For now, use findMany - in production you'd implement pagination here
    let users = await this._userRepository.findMany(criteria);
    
    // Apply search filter if provided
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchLower) || 
        u.email.toLowerCase().includes(searchLower),
      );
    }

    // Apply pagination
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
