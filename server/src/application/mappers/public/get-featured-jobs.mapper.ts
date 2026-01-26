import { PublicJobListItemDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { GetFeaturedJobsResponseDto } from 'src/application/dtos/public/listings/jobs/responses/get-featured-jobs-response.dto';

export class GetFeaturedJobsMapper {
  static toResponse(
    jobs: PublicJobListItemDto[],
    pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        },
  ): GetFeaturedJobsResponseDto {
    return {
      jobs,
      pagination,
    };
  }
}
