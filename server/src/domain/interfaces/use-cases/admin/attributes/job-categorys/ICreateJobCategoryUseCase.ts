import { JobCategoryResponseDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/job-category-response.dto';
import { CreateJobCategoryRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/create-job-category-request.dto';

export interface ICreateJobCategoryUseCase {
  execute(dto: CreateJobCategoryRequestDto): Promise<JobCategoryResponseDto>;
}
