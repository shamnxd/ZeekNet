import { SeekerProfile } from 'src/domain/entities/seeker-profile.entity';
import { SeekerProfileDocument } from 'src/infrastructure/persistence/mongodb/models/seeker-profile.model';
import { Types } from 'mongoose';

export class SeekerProfileMapper {
  static toEntity(doc: SeekerProfileDocument): SeekerProfile {
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

  static toDocument(entity: Partial<SeekerProfile>): Partial<SeekerProfileDocument> {
    const doc: Partial<SeekerProfileDocument> = {};

    if (entity.userId !== undefined) doc.userId = new Types.ObjectId(entity.userId);
    if (entity.headline !== undefined) doc.headline = entity.headline || undefined;
    if (entity.summary !== undefined) doc.summary = entity.summary || undefined;
    if (entity.location !== undefined) doc.location = entity.location || undefined;
    if (entity.phone !== undefined) doc.phone = entity.phone || undefined;
    if (entity.email !== undefined) doc.email = entity.email || undefined;
    if (entity.avatarFileName !== undefined) doc.avatarFileName = entity.avatarFileName || undefined;
    if (entity.bannerFileName !== undefined) doc.bannerFileName = entity.bannerFileName || undefined;
    if (entity.dateOfBirth !== undefined) doc.dateOfBirth = entity.dateOfBirth || undefined;
    if (entity.gender !== undefined) doc.gender = entity.gender || undefined;
    if (entity.skills !== undefined) doc.skills = entity.skills;
    if (entity.languages !== undefined) doc.languages = entity.languages;
    if (entity.socialLinks !== undefined) doc.socialLinks = entity.socialLinks;
    if (entity.resume !== undefined) doc.resume = entity.resume || undefined;

    return doc;
  }
}

