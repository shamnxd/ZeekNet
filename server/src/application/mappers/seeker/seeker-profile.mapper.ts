import {
  SeekerProfile,
} from '../../../domain/entities/seeker-profile.entity';
import {
  Experience,
  Education,
  ResumeMeta,
  SocialLink,
} from '../../../domain/interfaces/seeker-profile.interfaces';
import {
  SeekerProfileResponseDto,
  ExperienceResponseDto,
  EducationResponseDto,
  ResumeMetaResponseDto,
  SocialLinkResponseDto,
} from '../../dtos/seeker/responses/seeker-profile-response.dto';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { CreateInput } from '../../../domain/types/common.types';

export class SeekerProfileMapper {
  static toEntity(data: {
    userId: string;
    headline?: string | null;
    summary?: string | null;
    location?: string | null;
    phone?: string | null;
    email?: string | null;
    avatarFileName?: string | null;
    bannerFileName?: string | null;
    dateOfBirth?: Date | null;
    gender?: string | null;
    skills?: string[];
    languages?: string[];
    socialLinks?: SocialLink[];
    resume?: ResumeMeta | null;
  }): CreateInput<SeekerProfile> {
    return {
      userId: data.userId,
      headline: data.headline ?? null,
      summary: data.summary ?? null,
      location: data.location ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      avatarFileName: data.avatarFileName ?? null,
      bannerFileName: data.bannerFileName ?? null,
      dateOfBirth: data.dateOfBirth ?? null,
      gender: data.gender ?? null,
      skills: data.skills ?? [],
      languages: data.languages ?? [],
      socialLinks: data.socialLinks ?? [],
      resume: data.resume ?? null,
    };
  }

  static toResponse(
    profile: SeekerProfile, 
    s3Service: IS3Service,
    signedUrls?: { avatarUrl?: string | null; bannerUrl?: string | null; resumeUrl?: string | null },
  ): SeekerProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      name: '',
      headline: profile.headline,
      summary: profile.summary,
      location: profile.location,
      phone: profile.phone,
      email: profile.email,
      avatarUrl: signedUrls?.avatarUrl !== undefined ? signedUrls.avatarUrl : (profile.avatarFileName ? null : null),
      bannerUrl: signedUrls?.bannerUrl !== undefined ? signedUrls.bannerUrl : (profile.bannerFileName ? null : null),
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString() : null,
      gender: profile.gender,
      skills: profile.skills,
      languages: profile.languages,
      socialLinks: profile.socialLinks.map((link) => this.socialLinkToResponse(link)),
      resume: profile.resume ? this.resumeMetaToResponse(profile.resume, signedUrls?.resumeUrl) : null,
      experiences: [],
      education: [],
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static experienceToResponse(experience: Experience): ExperienceResponseDto {
    return {
      id: experience.id,
      title: experience.title,
      company: experience.company,
      startDate: experience.startDate.toISOString(),
      endDate: experience.endDate?.toISOString(),
      employmentType: experience.employmentType,
      location: experience.location,
      description: experience.description,
      technologies: experience.technologies,
      isCurrent: experience.isCurrent,
    };
  }

  static educationToResponse(education: Education): EducationResponseDto {
    return {
      id: education.id,
      school: education.school,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate.toISOString(),
      endDate: education.endDate?.toISOString(),
      grade: education.grade,
    };
  }

  static resumeMetaToResponse(resume: ResumeMeta, signedUrl?: string | null): ResumeMetaResponseDto {
    return {
      url: signedUrl || resume.url,
      fileName: resume.fileName,
      uploadedAt: resume.uploadedAt.toISOString(),
    };
  }

  static socialLinkToResponse(link: SocialLink): SocialLinkResponseDto {
    return {
      name: link.name,
      link: link.link,
    };
  }

  static toResumeEntity(data: {
    url: string;
    fileName: string;
    uploadedAt?: Date;
  }): ResumeMeta {
    return {
      url: data.url,
      fileName: data.fileName,
      uploadedAt: data.uploadedAt || new Date(),
    };
  }

  static toUpdateEntity(dto: Partial<{
    headline: string | null;
    summary: string | null;
    location: string | null;
    phone: string | null;
    email: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    skills: string[];
    languages: string[];
    socialLinks: SocialLink[];
  }>): Partial<SeekerProfile> {
    const updateData: Record<string, unknown> = {};
    if (dto.headline !== undefined) updateData.headline = dto.headline;
    if (dto.summary !== undefined) updateData.summary = dto.summary;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.dateOfBirth !== undefined) updateData.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
    if (dto.gender !== undefined) updateData.gender = dto.gender;
    if (dto.skills !== undefined) updateData.skills = dto.skills;
    if (dto.languages !== undefined) updateData.languages = dto.languages;
    if (dto.socialLinks !== undefined) updateData.socialLinks = dto.socialLinks;
    return updateData;
  }

  static toEducationUpdateEntity(dto: Partial<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string | null;
    grade: string;
  }>): Partial<Education> {
    const updateData: Partial<Education> = {};
    if (dto.school !== undefined) updateData.school = dto.school;
    if (dto.degree !== undefined) updateData.degree = dto.degree;
    if (dto.fieldOfStudy !== undefined) updateData.fieldOfStudy = dto.fieldOfStudy;
    if (dto.startDate !== undefined) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) updateData.endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    if (dto.grade !== undefined) updateData.grade = dto.grade;
    return updateData;
  }

  static toEducationEntity(data: {
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate: string | Date;
    endDate?: string | Date | null;
    grade?: string;
  }): CreateInput<Education> {
    return {
      school: data.school,
      degree: data.degree || '',
      fieldOfStudy: data.fieldOfStudy || '',
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      grade: data.grade || '',
    };
  }

  static toExperienceEntity(data: {
    title: string;
    company: string;
    startDate: string | Date;
    endDate?: string | Date | null;
    employmentType: string;
    location?: string;
    description?: string;
    technologies?: string[];
    isCurrent?: boolean;
  }): CreateInput<Experience> {
    return {
      title: data.title,
      company: data.company,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      employmentType: data.employmentType,
      location: data.location,
      description: data.description,
      technologies: data.technologies || [],
      isCurrent: data.isCurrent || false,
    };
  }

  static toExperienceUpdateEntity(dto: Partial<{
    title: string;
    company: string;
    startDate: string;
    endDate: string | null;
    employmentType: string;
    location: string;
    description: string;
    technologies: string[];
    isCurrent: boolean;
  }>): Partial<Experience> {
    const updateData: Partial<Experience> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.company !== undefined) updateData.company = dto.company;
    if (dto.startDate !== undefined) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) updateData.endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    if (dto.employmentType !== undefined) updateData.employmentType = dto.employmentType;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.technologies !== undefined) updateData.technologies = dto.technologies;
    if (dto.isCurrent !== undefined) updateData.isCurrent = dto.isCurrent;
    return updateData;
  }
}


