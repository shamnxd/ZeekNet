import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { IDeleteJobCategoryUseCase } from '../../../domain/interfaces/use-cases/IJobCategoryUseCases';
import { AppError } from '../../../domain/errors/errors';

export class DeleteJobCategoryUseCase implements IDeleteJobCategoryUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string): Promise<boolean> {
    const category = await this._jobCategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const deleted = await this._jobCategoryRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete category', 500);
    }

    return deleted;
  }
}
