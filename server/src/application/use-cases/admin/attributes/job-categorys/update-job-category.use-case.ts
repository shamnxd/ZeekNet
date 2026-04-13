import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { JobCategory } from 'src/domain/entities/job-category.entity';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'src/domain/errors/errors';
import { IUpdateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IUpdateJobCategoryUseCase';
import { UpdateJobCategoryRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/update-job-category-request.dto';
import { JobCategoryResponseDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/job-category-response.dto';
import { JobCategoryMapper } from 'src/application/mappers/job/job-category.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR, VALIDATION } from 'src/shared/constants/messages';


@injectable()
export class UpdateJobCategoryUseCase implements IUpdateJobCategoryUseCase {
  constructor(@inject(TYPES.JobCategoryRepository) private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string, dto: UpdateJobCategoryRequestDto): Promise<JobCategoryResponseDto> {
    const { name } = dto;
    
    if (!name || !name.trim()) {
      throw new BadRequestError(VALIDATION.REQUIRED('Category name'));
    }

    const category = await this._jobCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError(ERROR.NOT_FOUND('Category'));
    }

    const normalizedName = name.trim();
    const existingCategory = await this._jobCategoryRepository.findByName(normalizedName);
    
    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictError(ERROR.ALREADY_EXISTS('Category with this name'));
    }

    const updated = await this._jobCategoryRepository.update(id, { name: normalizedName });
    if (!updated) {
      throw new InternalServerError(ERROR.FAILED_TO('update category'));
    }

    return JobCategoryMapper.toResponse(updated);
  }
}
