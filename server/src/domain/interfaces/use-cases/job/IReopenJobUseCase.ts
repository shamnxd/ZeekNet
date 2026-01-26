import { ReopenJobRequestDto } from 'src/application/dtos/company/job/requests/reopen-job-request.dto';

export interface IReopenJobUseCase {
    execute(dto: ReopenJobRequestDto): Promise<void>;
}
