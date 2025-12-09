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
  execute(data: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

export interface IGetSeekerProfileUseCase {
  execute(userId: string): Promise<SeekerProfileResponseDto>;
}

export interface IUpdateSeekerProfileUseCase {
  execute(data: UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

export interface IAddExperienceUseCase {
  execute(data: AddExperienceRequestDto): Promise<ExperienceResponseDto>;
}

export interface IGetExperiencesUseCase {
  execute(userId: string): Promise<ExperienceResponseDto[]>;
}

export interface IUpdateExperienceUseCase {
  execute(data: UpdateExperienceRequestDto): Promise<ExperienceResponseDto>;
}

export interface IRemoveExperienceUseCase {
  execute(userId: string, experienceId: string): Promise<void>;
}

export interface IAddEducationUseCase {
  execute(data: AddEducationRequestDto): Promise<EducationResponseDto>;
}

export interface IGetEducationUseCase {
  execute(userId: string): Promise<EducationResponseDto[]>;
}

export interface IUpdateEducationUseCase {
  execute(data: UpdateEducationRequestDto): Promise<EducationResponseDto>;
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
  execute(data: UploadResumeRequestDto): Promise<ResumeMetaResponseDto>;
}

export interface IRemoveResumeUseCase {
  execute(userId: string): Promise<void>;
}

export interface IUploadAvatarUseCase {
  execute(data: UploadAvatarRequestDto): Promise<SeekerProfileResponseDto>;
}

export interface IUploadBannerUseCase {
  execute(data: UploadBannerRequestDto): Promise<SeekerProfileResponseDto>;
}