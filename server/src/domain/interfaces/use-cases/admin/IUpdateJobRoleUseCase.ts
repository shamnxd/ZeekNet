import { UpdateJobRoleRequestDto } from 'src/application/dto/admin/job-role-management.dto';
import { JobRole } from 'src/domain/entities/job-role.entity';

// no need interface
export interface IUpdateJobRoleUseCase {
  execute(data: UpdateJobRoleRequestDto): Promise<JobRole>;
}
