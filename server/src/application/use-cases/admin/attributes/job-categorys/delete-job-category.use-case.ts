import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { NotFoundError, InternalServerError } from 'src/domain/errors/errors';
import { IDeleteJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IDeleteJobCategoryUseCase';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class DeleteJobCategoryUseCase implements IDeleteJobCategoryUseCase {
  constructor(@inject(TYPES.JobCategoryRepository) private readonly _jobCategoryRepository: IJobCategoryRepository) {}

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
