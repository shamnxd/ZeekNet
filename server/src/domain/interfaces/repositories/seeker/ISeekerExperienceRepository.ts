import { Experience } from '../../../entities/seeker-profile.entity';

export interface ISeekerExperienceRepository {
  createForProfile(seekerProfileId: string, experience: Omit<Experience, 'id'>): Promise<Experience>;
  findById(id: string): Promise<Experience | null>;
  findMany(filter: Record<string, unknown>): Promise<Experience[]>;
  update(id: string, data: Partial<Experience>): Promise<Experience | null>;
  delete(id: string): Promise<boolean>;
}