import { GetFeaturedJobsRequestDto } from 'src/application/dtos/public/listings/jobs/requests/get-featured-jobs-request.dto';
import { GetFeaturedJobsResponseDto } from 'src/application/dtos/public/listings/jobs/responses/get-featured-jobs-response.dto';

export interface IGetFeaturedJobsUseCase {
    execute(dto: GetFeaturedJobsRequestDto): Promise<GetFeaturedJobsResponseDto>;
}
