import { JobCategory } from 'src/domain/entities/job-category.entity';
import { UpdateJobCategoryRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/update-job-category-request.dto';

export interface IUpdateJobCategoryUseCase {
  execute(id: string, dto: UpdateJobCategoryRequestDto): Promise<JobCategory>;
}
