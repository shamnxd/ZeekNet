import { SeekerProfile } from '../../../entities/seeker-profile.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ISeekerProfileRepository extends IBaseRepository<SeekerProfile> {
  getAll(options: {
    page: number;
    limit: number;
    search?: string;
    skills?: string[];
    location?: string;
  }): Promise<{ seekers: (SeekerProfile & { user: { name: string; email: string; _id: string } })[]; total: number }>;
}