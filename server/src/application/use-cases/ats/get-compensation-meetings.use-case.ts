import { IGetCompensationMeetingsUseCase } from '../../../domain/interfaces/use-cases/ats/IGetCompensationMeetingsUseCase';
import { IATSCompensationMeetingRepository } from '../../../domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { ATSCompensationMeeting } from '../../../domain/entities/ats-compensation-meeting.entity';

export class GetCompensationMeetingsUseCase implements IGetCompensationMeetingsUseCase {
  constructor(private compensationMeetingRepository: IATSCompensationMeetingRepository) {}

  async execute(applicationId: string): Promise<ATSCompensationMeeting[]> {
    return await this.compensationMeetingRepository.findByApplicationId(applicationId);
  }
}

