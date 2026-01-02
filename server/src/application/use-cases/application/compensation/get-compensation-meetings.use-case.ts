import { IGetCompensationMeetingsUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationMeetingsUseCase';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';

export class GetCompensationMeetingsUseCase implements IGetCompensationMeetingsUseCase {
  constructor(private _compensationMeetingRepository: IATSCompensationMeetingRepository) {}

  async execute(applicationId: string): Promise<ATSCompensationMeeting[]> {
    return await this._compensationMeetingRepository.findByApplicationId(applicationId);
  }
}

