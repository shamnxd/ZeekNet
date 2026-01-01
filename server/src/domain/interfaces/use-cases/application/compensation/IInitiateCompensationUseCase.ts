import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';

export interface IInitiateCompensationUseCase {
  execute(data: {
    applicationId: string;
    candidateExpected: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensation>;
}

