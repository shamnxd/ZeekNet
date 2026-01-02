import { JobCategory } from 'src/domain/entities/job-category.entity';


export interface IGetJobCategoryByIdUseCase {
  execute(id: string): Promise<JobCategory>;
}
