import { CompensationMeetingForSeekerDto } from '../../../../application/use-cases/seeker/get-compensation-meetings-by-application.use-case';

export interface IGetCompensationMeetingsByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<CompensationMeetingForSeekerDto[]>;
}
