import { ATSCompensation } from '../../../entities/ats-compensation.entity';

export interface IInitiateCompensationUseCase {
  execute(data: {
    applicationId: string;
    candidateExpected: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensation>;
}

