import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { NotFoundError, InternalServerError } from '../../../domain/errors/errors';
import { IDeleteJobCategoryUseCase } from 'src/domain/interfaces/use-cases/job-categories/IDeleteJobCategoryUseCase';

export class DeleteJobCategoryUseCase implements IDeleteJobCategoryUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string): Promise<boolean> {
    const category = await this._jobCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const deleted = await this._jobCategoryRepository.delete(id);
    if (!deleted) {
      throw new InternalServerError('Failed to delete category');
    }

    return deleted;
  }
}
