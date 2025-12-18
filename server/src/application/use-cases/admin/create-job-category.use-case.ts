import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { JobCategory } from '../../../domain/entities/job-category.entity';
import { BadRequestError, ConflictError } from '../../../domain/errors/errors';
import { ICreateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/job-categories/ICreateJobCategoryUseCase';

export class CreateJobCategoryUseCase implements ICreateJobCategoryUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(name: string): Promise<JobCategory> {
    if (!name || !name.trim()) {
      throw new BadRequestError('Category name is required');
    }

    const normalizedName = name.trim();
    const existingCategory = await this._jobCategoryRepository.findByName(normalizedName);
    
    if (existingCategory) {
      throw new ConflictError('Category with this name already exists');
    }

    return await this._jobCategoryRepository.create({ name: normalizedName });
  }
}
