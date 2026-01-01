import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';

export interface IGetCompensationUseCase {
  execute(applicationId: string): Promise<ATSCompensation | null>;
}

