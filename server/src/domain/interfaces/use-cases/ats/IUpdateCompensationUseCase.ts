import { ATSCompensation } from '../../../entities/ats-compensation.entity';

export interface IUpdateCompensationUseCase {
  execute(data: {
    applicationId: string;
    candidateExpected?: string;
    companyProposed?: string;
    expectedJoining?: Date;
    benefits?: string[];
    finalAgreed?: string;
    approvedAt?: Date;
    approvedBy?: string;
    approvedByName?: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensation>;
}

