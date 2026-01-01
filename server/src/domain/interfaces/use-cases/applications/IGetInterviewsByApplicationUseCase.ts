import { InterviewForSeekerDto } from '../../../../application/use-cases/seeker/get-interviews-by-application.use-case';

export interface IGetInterviewsByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<InterviewForSeekerDto[]>;
}
