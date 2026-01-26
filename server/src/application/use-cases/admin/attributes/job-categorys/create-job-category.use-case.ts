import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { JobCategory } from 'src/domain/entities/job-category.entity';
import { BadRequestError, ConflictError } from 'src/domain/errors/errors';
import { ICreateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/ICreateJobCategoryUseCase';
import { CreateJobCategoryRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/create-job-category-request.dto';
import { JobCategoryResponseDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/job-category-response.dto';
import { JobCategoryMapper } from 'src/application/mappers/job/job-category.mapper';

export class CreateJobCategoryUseCase implements ICreateJobCategoryUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(dto: CreateJobCategoryRequestDto): Promise<JobCategoryResponseDto> {
    const { name } = dto;
    
    if (!name || !name.trim()) {
      throw new BadRequestError('Category name is required');
    }

    const normalizedName = name.trim();
    const existingCategory = await this._jobCategoryRepository.findByName(normalizedName);
    
    if (existingCategory) {
      throw new ConflictError('Category with this name already exists');
    }

    const category = await this._jobCategoryRepository.create({ name: normalizedName });
    return JobCategoryMapper.toResponse(category);
  }
}
