import { GetAllJobCategoriesRequestDto } from 'src/application/dto/admin/job-category.dto';
import { PaginatedJobCategories } from './PaginatedJobCategories';


export interface IGetAllJobCategoriesUseCase {
  execute(options: GetAllJobCategoriesRequestDto): Promise<PaginatedJobCategories>;
}
