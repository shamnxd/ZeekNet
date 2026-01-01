import { TechnicalTaskForSeekerDto } from '../../../../application/use-cases/seeker/get-technical-tasks-by-application.use-case';

export interface IGetTechnicalTasksByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<TechnicalTaskForSeekerDto[]>;
}
