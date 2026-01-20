import { JobRole } from 'src/domain/entities/job-role.entity';
import { CreateJobRoleRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/create-job-role-request.dto';

export interface ICreateJobRoleUseCase {
  execute(dto: CreateJobRoleRequestDto): Promise<JobRole>;
}
