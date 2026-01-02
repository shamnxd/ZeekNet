import { Experience, Education, ResumeMeta, SocialLink } from 'src/domain/interfaces/seeker-profile.interfaces';

export { Experience, Education, ResumeMeta, SocialLink };

export class SeekerProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly headline: string | null,
    public readonly summary: string | null,
    public readonly location: string | null,
    public readonly phone: string | null,
    public readonly email: string | null, 
    public readonly avatarFileName: string | null, 
    public readonly bannerFileName: string | null, 
    public readonly dateOfBirth: Date | null,
    public readonly gender: string | null,
    public readonly skills: string[],
    public readonly languages: string[],
    public readonly socialLinks: SocialLink[],
    public readonly resume: ResumeMeta | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    userId: string;
    headline?: string;
    summary?: string;
    location?: string;
    phone?: string;
    email?: string | null; 
    avatarFileName?: string | null; 
    bannerFileName?: string | null; 
    dateOfBirth?: Date | null;
    gender?: string | null;
    skills?: string[];
    languages?: string[];
    socialLinks?: SocialLink[];
    resume?: ResumeMeta;
    createdAt?: Date;
    updatedAt?: Date;
  }): SeekerProfile {
    const now = new Date();
    return new SeekerProfile(
      data.id,
      data.userId,
      data.headline ?? null,
      data.summary ?? null,
      data.location ?? null,
      data.phone ?? null,
      data.email ?? null,
      data.avatarFileName ?? null,
      data.bannerFileName ?? null,
      data.dateOfBirth ?? null,
      data.gender ?? null,
      data.skills ?? [],
      data.languages ?? [],
      data.socialLinks ?? [],
      data.resume ?? null,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }

}
