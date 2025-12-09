import { GetApplicationDetailsRequestDto } from 'src/application/dto/application/get-application-details.dto';
import type { JobApplicationDetailResponseDto } from 'src/application/dto/application/job-application-response.dto';


export interface IGetApplicationDetailsUseCase {
  execute(data: GetApplicationDetailsRequestDto): Promise<JobApplicationDetailResponseDto>;
}
