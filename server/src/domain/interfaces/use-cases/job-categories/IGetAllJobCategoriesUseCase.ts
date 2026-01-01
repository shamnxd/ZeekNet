import { GetAllJobCategoriesRequestDto } from 'src/application/dtos/admin/common/job-category.dto';
import { PaginatedJobCategoriesResultDto } from 'src/application/dtos/job-categories/common/paginated-job-categories-result.dto';


export interface IGetAllJobCategoriesUseCase {
  execute(options: GetAllJobCategoriesRequestDto): Promise<PaginatedJobCategoriesResultDto>;
}

