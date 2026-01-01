import { JobCategory } from 'src/domain/entities/job-category.entity';


export interface IUpdateJobCategoryUseCase {
  execute(id: string, name: string): Promise<JobCategory>;
}
