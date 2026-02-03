import { CloseJobDto } from 'src/application/dtos/company/job/requests/close-job.dto';

export interface ICloseJobManuallyUseCase {
    execute(dto: CloseJobDto): Promise<void>;
}
