import { GetAllJobCategoriesRequestDto } from 'src/application/dto/admin/job-category.dto';
import { PaginatedJobCategoriesResultDto } from 'src/application/dto/job-categories/paginated-job-categories-result.dto';


export interface IGetAllJobCategoriesUseCase {
  execute(options: GetAllJobCategoriesRequestDto): Promise<PaginatedJobCategoriesResultDto>;
}
