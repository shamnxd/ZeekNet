import { JobRoleResponseDto } from 'src/application/dtos/admin/attributes/job-roles/responses/job-role-response.dto';
import { CreateJobRoleRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/create-job-role-request.dto';

export interface ICreateJobRoleUseCase {
  execute(dto: CreateJobRoleRequestDto): Promise<JobRoleResponseDto>;
}
