import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';

export interface IATSCompensationRepository {
  create(compensation: ATSCompensation): Promise<ATSCompensation>;
  findByApplicationId(applicationId: string): Promise<ATSCompensation | null>;
  update(applicationId: string, data: Partial<ATSCompensation>): Promise<ATSCompensation | null>;
  delete(applicationId: string): Promise<boolean>;
}


export interface IATSCompensationRepository {
  create(compensation: ATSCompensation): Promise<ATSCompensation>;
  findByApplicationId(applicationId: string): Promise<ATSCompensation | null>;
  update(applicationId: string, data: Partial<ATSCompensation>): Promise<ATSCompensation | null>;
  delete(applicationId: string): Promise<boolean>;
}


export interface IATSCompensationRepository {
  create(compensation: ATSCompensation): Promise<ATSCompensation>;
  findByApplicationId(applicationId: string): Promise<ATSCompensation | null>;
  update(applicationId: string, data: Partial<ATSCompensation>): Promise<ATSCompensation | null>;
  delete(applicationId: string): Promise<boolean>;
}



