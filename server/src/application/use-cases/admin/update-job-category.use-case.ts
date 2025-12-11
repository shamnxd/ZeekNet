import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { JobCategory } from '../../../domain/entities/job-category.entity';
import { AppError } from '../../../domain/errors/errors';
import { IUpdateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/job-categories/IUpdateJobCategoryUseCase';

export class UpdateJobCategoryUseCase implements IUpdateJobCategoryUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string, name: string): Promise<JobCategory> {
    if (!name || !name.trim()) {
      throw new AppError('Category name is required', 400);
    }

    const category = await this._jobCategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const normalizedName = name.trim();
    const existingCategory = await this._jobCategoryRepository.findByName(normalizedName);
    
    if (existingCategory && existingCategory.id !== id) {
      throw new AppError('Category with this name already exists', 409);
    }

    const updated = await this._jobCategoryRepository.update(id, { name: normalizedName });
    if (!updated) {
      throw new AppError('Failed to update category', 500);
    }

    return updated;
  }
}
