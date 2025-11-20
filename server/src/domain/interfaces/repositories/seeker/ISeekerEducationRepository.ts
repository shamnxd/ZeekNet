import { Education } from '../../../entities/seeker-profile.entity';

export interface ISeekerEducationRepository {
  createForProfile(seekerProfileId: string, education: Omit<Education, 'id'>): Promise<Education>;
  findById(id: string): Promise<Education | null>;
  findMany(filter: Record<string, unknown>): Promise<Education[]>;
  update(id: string, data: Partial<Education>): Promise<Education | null>;
  delete(id: string): Promise<boolean>;
}