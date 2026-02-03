import { IGetCompensationMeetingsUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationMeetingsUseCase';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { ATSCompensationMeetingResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation-meeting-response.dto';
import { ATSCompensationMeetingMapper } from 'src/application/mappers/ats/ats-compensation-meeting.mapper';

export class GetCompensationMeetingsUseCase implements IGetCompensationMeetingsUseCase {
  constructor(private _compensationMeetingRepository: IATSCompensationMeetingRepository) {}

  async execute(applicationId: string): Promise<ATSCompensationMeetingResponseDto[]> {
    const meetings = await this._compensationMeetingRepository.findByApplicationId(applicationId);
    return ATSCompensationMeetingMapper.toResponseList(meetings);
  }
}

