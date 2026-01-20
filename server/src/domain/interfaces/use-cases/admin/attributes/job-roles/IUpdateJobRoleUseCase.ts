import { JobRole } from 'src/domain/entities/job-role.entity';
import { UpdateJobRoleRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/update-job-role-request.dto';

export interface IUpdateJobRoleUseCase {
  execute(jobRoleId: string, dto: UpdateJobRoleRequestDto): Promise<JobRole>;
}
