import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { JobCategory } from 'src/domain/entities/job-category.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetJobCategoryByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IGetJobCategoryByIdUseCase';
import { JobCategoryResponseDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/job-category-response.dto';
import { JobCategoryMapper } from 'src/application/mappers/job/job-category.mapper';

export class GetJobCategoryByIdUseCase implements IGetJobCategoryByIdUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string): Promise<JobCategoryResponseDto> {
    const category = await this._jobCategoryRepository.findById(id);
    
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return JobCategoryMapper.toResponse(category);
  }
}
