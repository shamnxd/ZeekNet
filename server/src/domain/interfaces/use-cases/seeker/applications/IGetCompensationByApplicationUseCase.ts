import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';

export interface IGetCompensationByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<ATSCompensation | null>;
}
