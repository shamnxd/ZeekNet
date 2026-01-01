import { JobRole } from 'src/domain/entities/job-role.entity';

export interface IGetJobRoleByIdUseCase {
  execute(jobRoleId: string): Promise<JobRole>;
}
