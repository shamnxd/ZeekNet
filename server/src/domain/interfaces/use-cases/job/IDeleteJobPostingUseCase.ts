
import { DeleteCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/delete-company-job-posting.dto';

export interface IDeleteJobPostingUseCase {
  execute(dto: DeleteCompanyJobPostingDto): Promise<void>;
}
