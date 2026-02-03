import { JobRoleResponseDto } from 'src/application/dtos/admin/attributes/job-roles/responses/job-role-response.dto';
import { UpdateJobRoleRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/update-job-role-request.dto';

export interface IUpdateJobRoleUseCase {
  execute(jobRoleId: string, dto: UpdateJobRoleRequestDto): Promise<JobRoleResponseDto>;
}
