import { ATSCompensation } from '../../../entities/ats-compensation.entity';

export interface IGetCompensationByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<ATSCompensation | null>;
}
