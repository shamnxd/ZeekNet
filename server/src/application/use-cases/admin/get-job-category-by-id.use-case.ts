import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { JobCategory } from '../../../domain/entities/job-category.entity';
import { AppError } from '../../../domain/errors/errors';
import { IGetJobCategoryByIdUseCase } from 'src/domain/interfaces/use-cases/job-categorys/IGetJobCategoryByIdUseCase';

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
