import { JobCategory } from '../../entities/job-category.entity';
import { PaginatedJobCategories } from './job-categorys/PaginatedJobCategories';

export interface ICreateJobCategoryUseCase {
  execute(name: string): Promise<JobCategory>;
}

export interface IGetAllJobCategoriesUseCase {
  execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedJobCategories>;
}

export interface IGetJobCategoryByIdUseCase {
  execute(id: string): Promise<JobCategory>;
}

export interface IUpdateJobCategoryUseCase {
  execute(id: string, name: string): Promise<JobCategory>;
}

export interface IDeleteJobCategoryUseCase {
  execute(id: string): Promise<boolean>;
}