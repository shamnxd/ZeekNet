import { JobRole } from 'src/domain/entities/job-role.entity';

export interface IUpdateJobRoleUseCase {
  execute(jobRoleId: string, name: string): Promise<JobRole>;
}
