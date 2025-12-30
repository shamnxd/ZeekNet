import { ATSCompensation } from '../../../entities/ats-compensation.entity';

export interface IGetCompensationUseCase {
  execute(applicationId: string): Promise<ATSCompensation | null>;
}

