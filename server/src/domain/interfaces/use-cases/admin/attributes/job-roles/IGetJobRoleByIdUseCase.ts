import { JobRoleResponseDto } from 'src/application/dtos/admin/attributes/job-roles/responses/job-role-response.dto';

export interface IGetJobRoleByIdUseCase {
  execute(jobRoleId: string): Promise<JobRoleResponseDto>;
}
