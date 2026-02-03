import { UpdateCompensationMeetingStatusRequestDto } from 'src/application/dtos/application/compensation/requests/update-compensation-meeting-status.dto';
import { ATSCompensationMeetingResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation-meeting-response.dto';

export interface IUpdateCompensationMeetingStatusUseCase {
  execute(dto: UpdateCompensationMeetingStatusRequestDto): Promise<ATSCompensationMeetingResponseDto>;
}

