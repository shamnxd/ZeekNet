import {
  SeekerProfile,
  Experience,
  Education,
  ResumeMeta,
  SocialLink,
} from '../../domain/entities/seeker-profile.entity';
import {
  SeekerProfileResponseDto,
  ExperienceResponseDto,
  EducationResponseDto,
  ResumeMetaResponseDto,
  SocialLinkResponseDto,
} from '../dto/seeker/seeker-profile-response.dto';
import { IS3Service } from '../../domain/interfaces/services/IS3Service';

export class SeekerProfileMapper {
  static toResponse(profile: SeekerProfile, s3Service: IS3Service): SeekerProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      name: '',
      headline: profile.headline,
      summary: profile.summary,
      location: profile.location,
      phone: profile.phone,
      email: profile.email,
      avatarUrl: profile.avatarFileName ? s3Service.getImageUrl(profile.avatarFileName) : null,
      bannerUrl: profile.bannerFileName ? s3Service.getImageUrl(profile.bannerFileName) : null,
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString() : null,
      gender: profile.gender,
      skills: profile.skills,
      languages: profile.languages,
      socialLinks: profile.socialLinks.map((link) => this.socialLinkToResponse(link)),
      resume: profile.resume ? this.resumeMetaToResponse(profile.resume) : null,
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

  static resumeMetaToResponse(resume: ResumeMeta): ResumeMetaResponseDto {
    return {
      url: resume.url,
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
}
