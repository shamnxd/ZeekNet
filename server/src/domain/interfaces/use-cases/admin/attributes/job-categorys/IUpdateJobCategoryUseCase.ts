import { JobCategoryResponseDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/job-category-response.dto';
import { UpdateJobCategoryRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/update-job-category-request.dto';

export interface IUpdateJobCategoryUseCase {
  execute(id: string, dto: UpdateJobCategoryRequestDto): Promise<JobCategoryResponseDto>;
}
