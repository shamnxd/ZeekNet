import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { JobCategory } from 'src/domain/entities/job-category.entity';
import { BadRequestError, ConflictError } from 'src/domain/errors/errors';
import { ICreateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/ICreateJobCategoryUseCase';

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
