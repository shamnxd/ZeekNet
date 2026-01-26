import { JobCategoryResponseDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/job-category-response.dto';

export interface IGetJobCategoryByIdUseCase {
  execute(id: string): Promise<JobCategoryResponseDto>;
}
