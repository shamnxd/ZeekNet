import { Experience } from 'src/domain/entities/seeker-profile.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';
import { CreateInput } from 'src/domain/types/common.types';

export interface ISeekerExperienceRepository extends IBaseRepository<Experience> {
  createForProfile(seekerProfileId: string, experience: Omit<Experience, 'id'>): Promise<Experience>;
  findBySeekerProfileId(seekerProfileId: string): Promise<Experience[]>;
}
