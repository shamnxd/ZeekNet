import { ISeekerProfileRepository } from '../../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { SeekerProfile, ResumeMeta, SocialLink } from '../../../../domain/entities/seeker-profile.entity';
import { SeekerProfileModel, SeekerProfileDocument as ModelDocument } from '../models/seeker-profile.model';
import { RepositoryBase } from './base-repository';
import { Types } from 'mongoose';

export class SeekerProfileRepository extends RepositoryBase<SeekerProfile, ModelDocument> implements ISeekerProfileRepository {
  constructor() {
    super(SeekerProfileModel);
  }

  protected mapToEntity(doc: ModelDocument): SeekerProfile {
    return SeekerProfile.create({
      id: String(doc._id),
      userId: String(doc.userId),
      headline: doc.headline || undefined,
      summary: doc.summary || undefined,
      location: doc.location || undefined,
      phone: doc.phone || undefined,
      email: doc.email || null,
      avatarFileName: doc.avatarFileName || null,
      bannerFileName: doc.bannerFileName || null,
      dateOfBirth: doc.dateOfBirth || null,
      gender: doc.gender || null,
      skills: doc.skills || [],
      languages: doc.languages || [],
      socialLinks: doc.socialLinks || [],
      resume: doc.resume ? {
        url: doc.resume.url,
        fileName: doc.resume.fileName,
        uploadedAt: doc.resume.uploadedAt,
      } : undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}