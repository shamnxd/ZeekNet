import { Experience } from '../../../entities/seeker-profile.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ISeekerExperienceRepository extends IBaseRepository<Experience> {
  createForProfile(seekerProfileId: string, experience: Omit<Experience, 'id'>): Promise<Experience>;
  findBySeekerProfileId(seekerProfileId: string): Promise<Experience[]>;
}