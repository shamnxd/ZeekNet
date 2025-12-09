import { JobCategory } from '../../entities/job-category.entity';
import { PaginatedJobCategories } from './job-categorys/PaginatedJobCategories';
import { GetAllJobCategoriesRequestDto } from 'src/application/dto/admin/job-category.dto';
import { UpdateJobCategoryRequestDto } from 'src/application/dto/admin/update-job-category.dto';

export interface ICreateJobCategoryUseCase {
  execute(name: string): Promise<JobCategory>;
}

export interface IGetAllJobCategoriesUseCase {
  execute(options: GetAllJobCategoriesRequestDto): Promise<PaginatedJobCategories>;
}

export interface IGetJobCategoryByIdUseCase {
  execute(id: string): Promise<JobCategory>;
}

export interface IUpdateJobCategoryUseCase {
  execute(data: UpdateJobCategoryRequestDto): Promise<JobCategory>;
}

export interface IDeleteJobCategoryUseCase {
  execute(id: string): Promise<boolean>;
}