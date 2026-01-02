import { Education } from 'src/domain/entities/seeker-profile.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';
import { CreateInput } from 'src/domain/types/common.types';

export interface ISeekerEducationRepository extends IBaseRepository<Education> {
  createForProfile(seekerProfileId: string, education: Omit<Education, 'id'>): Promise<Education>;
  findBySeekerProfileId(seekerProfileId: string): Promise<Education[]>;
}
