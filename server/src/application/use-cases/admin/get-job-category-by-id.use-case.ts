import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { JobCategory } from '../../../domain/entities/job-category.entity';
import { IGetJobCategoryByIdUseCase } from '../../../domain/interfaces/use-cases/IJobCategoryUseCases';
import { AppError } from '../../../domain/errors/errors';

export class GetJobCategoryByIdUseCase implements IGetJobCategoryByIdUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string): Promise<JobCategory> {
    const category = await this._jobCategoryRepository.findById(id);
    
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }
}
