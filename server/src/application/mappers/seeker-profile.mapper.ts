import { SeekerProfile, Experience, Education, ResumeMeta, SocialLink } from '../../domain/entities/seeker-profile.entity';
import {
  SeekerProfileResponseDto,
  ExperienceResponseDto,
  EducationResponseDto,
  ResumeMetaResponseDto,
  SocialLinkResponseDto,
} from '../dto/seeker/seeker-profile-response.dto';
import {
  CreateSeekerProfileRequestDto,
  AddExperienceRequestDto,
  AddEducationRequestDto,
  UpdateSeekerProfileRequestDto,
  UpdateExperienceRequestDto,
  UpdateEducationRequestDto,
  UploadResumeRequestDto,
} from '../dto/seeker/seeker-profile.dto';
import { CreateSeekerProfileData, UpdateSeekerProfileData } from '../../domain/interfaces/use-cases/ISeekerUseCases';
import { IS3Service } from '../../domain/interfaces/services/IS3Service';

export class SeekerProfileMapper {
  
  static toDto(profile: SeekerProfile, s3Service: IS3Service): SeekerProfileResponseDto {
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
      socialLinks: profile.socialLinks.map(link => this.socialLinkToDto(link)),
      resume: profile.resume ? this.resumeMetaToDto(profile.resume) : null,
      experiences: [], 
      education: [], 
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static experienceToDto(experience: Experience): ExperienceResponseDto {
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

  static educationToDto(education: Education): EducationResponseDto {
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

  static resumeMetaToDto(resume: ResumeMeta): ResumeMetaResponseDto {
    return {
      url: resume.url,
      fileName: resume.fileName,
      uploadedAt: resume.uploadedAt.toISOString(),
    };
  }

  static socialLinkToDto(link: SocialLink): SocialLinkResponseDto {
    return {
      name: link.name,
      link: link.link,
    };
  }

  static createProfileDataFromDto(dto: CreateSeekerProfileRequestDto): CreateSeekerProfileData {
    return {
      headline: dto.headline,
      summary: dto.summary,
      location: dto.location,
      phone: dto.phone,
      email: dto.email,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      gender: dto.gender,
      skills: dto.skills,
      languages: dto.languages,
      socialLinks: dto.socialLinks?.map(link => ({
        name: link.name,
        link: link.link,
      })),
    };
  }

  static updateProfileDataFromDto(dto: UpdateSeekerProfileRequestDto): UpdateSeekerProfileData {
    return {
      headline: dto.headline,
      summary: dto.summary,
      location: dto.location,
      phone: dto.phone,
      email: dto.email,
      name : dto.name,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      gender: dto.gender,
      skills: dto.skills,
      languages: dto.languages,
      socialLinks: dto.socialLinks?.map(link => ({
        name: link.name,
        link: link.link,
      })),
    };
  }

  static experienceDataFromDto(dto: AddExperienceRequestDto | UpdateExperienceRequestDto): {
    title?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
    employmentType?: string;
    location?: string;
    description?: string;
    technologies?: string[];
    isCurrent?: boolean;
  } {
    return {
      title: dto.title,
      company: dto.company,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      employmentType: dto.employmentType,
      location: dto.location,
      description: dto.description,
      technologies: dto.technologies,
      isCurrent: dto.isCurrent,
    };
  }

  static educationDataFromDto(dto: AddEducationRequestDto | UpdateEducationRequestDto): {
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date;
    grade?: string;
  } {
    return {
      school: dto.school,
      degree: dto.degree,
      fieldOfStudy: dto.fieldOfStudy,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      grade: dto.grade,
    };
  }

  static resumeMetaDataFromDto(dto: UploadResumeRequestDto): ResumeMeta {
    return {
      url: dto.url,
      fileName: dto.fileName,
      uploadedAt: new Date(),
    };
  }
}