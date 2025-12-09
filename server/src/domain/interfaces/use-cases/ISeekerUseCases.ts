import { SocialLink, ResumeMeta } from '../../entities/seeker-profile.entity';
import { 
  SeekerProfileResponseDto, 
  ExperienceResponseDto, 
  EducationResponseDto, 
  ResumeMetaResponseDto, 
} from '../../../application/dto/seeker/seeker-profile-response.dto';
import { UploadAvatarRequestDto, UploadBannerRequestDto } from 'src/application/dto/seeker/upload-file.dto';
import {
  CreateSeekerProfileRequestDto,
  UpdateSeekerProfileRequestDto,
  AddExperienceRequestDto,
  UpdateExperienceRequestDto,
  AddEducationRequestDto,
  UpdateEducationRequestDto,
  UploadResumeRequestDto,
} from 'src/application/dto/seeker/seeker-profile.dto';

export interface ICreateSeekerProfileUseCase {
  execute(userId: string, dto: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

export interface IGetSeekerProfileUseCase {
  execute(userId: string): Promise<SeekerProfileResponseDto>;
}

export interface IUpdateSeekerProfileUseCase {
  execute(userId: string, dto: UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

export interface IAddExperienceUseCase {
  execute(userId: string, dto: AddExperienceRequestDto): Promise<ExperienceResponseDto>;
}

export interface IGetExperiencesUseCase {
  execute(userId: string): Promise<ExperienceResponseDto[]>;
}

export interface IUpdateExperienceUseCase {
  execute(userId: string, experienceId: string, dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto>;
}

export interface IRemoveExperienceUseCase {
  execute(userId: string, experienceId: string): Promise<void>;
}

export interface IAddEducationUseCase {
  execute(userId: string, dto: AddEducationRequestDto): Promise<EducationResponseDto>;
}

export interface IGetEducationUseCase {
  execute(userId: string): Promise<EducationResponseDto[]>;
}

export interface IUpdateEducationUseCase {
  execute(userId: string, educationId: string, dto: UpdateEducationRequestDto): Promise<EducationResponseDto>;
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
  execute(userId: string, dto: UploadResumeRequestDto): Promise<ResumeMetaResponseDto>;
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