import { ToggleFeaturedJobDto } from 'src/application/dtos/company/job/requests/toggle-featured-job.dto';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';

export interface IToggleFeaturedJobUseCase {
    execute(data: ToggleFeaturedJobDto): Promise<JobPostingResponseDto>;
}
