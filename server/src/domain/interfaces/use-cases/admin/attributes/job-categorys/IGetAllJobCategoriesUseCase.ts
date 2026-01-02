import { GetAllJobCategoriesRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/get-all-job-categories-query.dto';
import { PaginatedJobCategoriesResultDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/paginated-job-categories-result.dto';


export interface IGetAllJobCategoriesUseCase {
  execute(options: GetAllJobCategoriesRequestDto): Promise<PaginatedJobCategoriesResultDto>;
}

