import { SocialLink, ResumeMeta } from '../../entities/seeker-profile.entity';
import { 
  SeekerProfileResponseDto, 
  ExperienceResponseDto, 
  EducationResponseDto, 
  ResumeMetaResponseDto, 
} from '../../../application/dto/seeker/seeker-profile-response.dto';

export interface CreateSeekerProfileData {
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  email?: string; 
  avatarFileName?: string | null; 
  bannerFileName?: string | null; 
  dateOfBirth?: Date | null;
  gender?: string | null;
  skills?: string[];
  languages?: string[];
  socialLinks?: SocialLink[];
}

export interface UpdateSeekerProfileData {
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  email?: string;
  name?: string;
  avatarFileName?: string | null; 
  bannerFileName?: string | null; 
  dateOfBirth?: Date | null;
  gender?: string | null;
  skills?: string[];
  languages?: string[];
  socialLinks?: SocialLink[];
}

export interface AddExperienceData {
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  employmentType: string;
  location?: string;
  description?: string;
  technologies?: string[];
  isCurrent?: boolean;
}

export interface UpdateExperienceData {
  title?: string;
  company?: string;
  startDate?: Date;
  endDate?: Date;
  employmentType?: string;
  location?: string;
  description?: string;
  technologies?: string[];
  isCurrent?: boolean;
}

export interface AddEducationData {
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
}

export interface UpdateEducationData {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  grade?: string;
}

export interface ICreateSeekerProfileUseCase {
  execute(userId: string, dto: import('../../../application/dto/seeker/seeker-profile.dto').CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

export interface IGetSeekerProfileUseCase {
  execute(userId: string): Promise<SeekerProfileResponseDto>;
}

export interface IUpdateSeekerProfileUseCase {
  execute(userId: string, dto: import('../../../application/dto/seeker/seeker-profile.dto').UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

export interface IAddExperienceUseCase {
  execute(userId: string, dto: import('../../../application/dto/seeker/seeker-profile.dto').AddExperienceRequestDto): Promise<ExperienceResponseDto>;
}

export interface IGetExperiencesUseCase {
  execute(userId: string): Promise<ExperienceResponseDto[]>;
}

export interface IUpdateExperienceUseCase {
  execute(userId: string, experienceId: string, dto: import('../../../application/dto/seeker/seeker-profile.dto').UpdateExperienceRequestDto): Promise<ExperienceResponseDto>;
}

export interface IRemoveExperienceUseCase {
  execute(userId: string, experienceId: string): Promise<void>;
}

export interface IAddEducationUseCase {
  execute(userId: string, dto: import('../../../application/dto/seeker/seeker-profile.dto').AddEducationRequestDto): Promise<EducationResponseDto>;
}

export interface IGetEducationUseCase {
  execute(userId: string): Promise<EducationResponseDto[]>;
}

export interface IUpdateEducationUseCase {
  execute(userId: string, educationId: string, dto: import('../../../application/dto/seeker/seeker-profile.dto').UpdateEducationRequestDto): Promise<EducationResponseDto>;
}

export interface IRemoveEducationUseCase {
  execute(userId: string, educationId: string): Promise<void>;
}

export interface IUpdateSkillsUseCase {
  execute(userId: string, skills: string[]): Promise<string[]>;
}

export interface IUpdateLanguagesUseCase {
  execute(userId: string, languages: string[]): Promise<string[]>;
}

export interface IUploadResumeUseCase {
  execute(userId: string, dto: import('../../../application/dto/seeker/seeker-profile.dto').UploadResumeRequestDto): Promise<ResumeMetaResponseDto>;
}

export interface IRemoveResumeUseCase {
  execute(userId: string): Promise<void>;
}

export interface IUploadAvatarUseCase {
  execute(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<SeekerProfileResponseDto>;
}

export interface IUploadBannerUseCase {
  execute(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<SeekerProfileResponseDto>;
}