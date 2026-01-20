import { JobCategory } from 'src/domain/entities/job-category.entity';
import { CreateJobCategoryRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/create-job-category-request.dto';

export interface ICreateJobCategoryUseCase {
  execute(dto: CreateJobCategoryRequestDto): Promise<JobCategory>;
}
