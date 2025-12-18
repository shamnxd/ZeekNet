import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { JobCategory } from '../../../domain/entities/job-category.entity';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '../../../domain/errors/errors';
import { IUpdateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/job-categories/IUpdateJobCategoryUseCase';

export class UpdateJobCategoryUseCase implements IUpdateJobCategoryUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string, name: string): Promise<JobCategory> {
    if (!name || !name.trim()) {
      throw new BadRequestError('Category name is required');
    }

    const category = await this._jobCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const normalizedName = name.trim();
    const existingCategory = await this._jobCategoryRepository.findByName(normalizedName);
    
    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictError('Category with this name already exists');
    }

    const updated = await this._jobCategoryRepository.update(id, { name: normalizedName });
    if (!updated) {
      throw new InternalServerError('Failed to update category');
    }

    return updated;
  }
}
