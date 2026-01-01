import { JobCategory } from 'src/domain/entities/job-category.entity';


export interface ICreateJobCategoryUseCase {
  execute(name: string): Promise<JobCategory>;
}
