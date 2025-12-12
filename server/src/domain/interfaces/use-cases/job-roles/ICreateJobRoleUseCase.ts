import { JobRole } from 'src/domain/entities/job-role.entity';

export interface ICreateJobRoleUseCase {
  execute(name: string): Promise<JobRole>;
}
