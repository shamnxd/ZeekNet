import { api } from './index';
import { uploadFile } from '@/shared/utils/file-upload.util';
import type { ApiEnvelope } from '@/interfaces/auth';
import { SeekerRoutes } from '@/constants/api-routes';

import type {
  SeekerProfile,
  Experience,
  Education,
  ResumeMeta,
  CreateSeekerProfileRequest,
  UpdateSeekerProfileRequest,
  AddExperienceRequest,
  UpdateExperienceRequest,
  AddEducationRequest,
  UpdateEducationRequest,
  UploadResumeRequest
} from '@/interfaces/seeker/seeker.interface';

// Re-export publicly available interfaces
export type { SeekerProfile, Experience, Education };

export const seekerApi = {
  
  async getProfile(): Promise<ApiEnvelope<SeekerProfile>> {
    return (await api.get<ApiEnvelope<SeekerProfile>>(SeekerRoutes.PROFILE)).data;
  },

  async createProfile(data: CreateSeekerProfileRequest): Promise<ApiEnvelope<SeekerProfile>> {
    return (await api.post<ApiEnvelope<SeekerProfile>>(SeekerRoutes.PROFILE, data)).data;
  },

  async updateProfile(data: UpdateSeekerProfileRequest): Promise<ApiEnvelope<SeekerProfile>> {
    return (await api.put<ApiEnvelope<SeekerProfile>>(SeekerRoutes.PROFILE, data)).data;
  },

  async getExperiences(): Promise<ApiEnvelope<Experience[]>> {
    return (await api.get<ApiEnvelope<Experience[]>>(SeekerRoutes.PROFILE_EXPERIENCES)).data;
  },

  async addExperience(data: AddExperienceRequest): Promise<ApiEnvelope<Experience>> {
    return (await api.post<ApiEnvelope<Experience>>(SeekerRoutes.PROFILE_EXPERIENCES, data)).data;
  },

  async updateExperience(experienceId: string, data: UpdateExperienceRequest): Promise<ApiEnvelope<Experience>> {
    return (await api.put<ApiEnvelope<Experience>>(SeekerRoutes.PROFILE_EXPERIENCES_ID.replace(':experienceId', experienceId), data)).data;
  },

  async removeExperience(experienceId: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(SeekerRoutes.PROFILE_EXPERIENCES_ID.replace(':experienceId', experienceId))).data;
  },

  async getEducation(): Promise<ApiEnvelope<Education[]>> {
    return (await api.get<ApiEnvelope<Education[]>>(SeekerRoutes.PROFILE_EDUCATION)).data;
  },

  async addEducation(data: AddEducationRequest): Promise<ApiEnvelope<Education>> {
    return (await api.post<ApiEnvelope<Education>>(SeekerRoutes.PROFILE_EDUCATION, data)).data;
  },

  async updateEducation(educationId: string, data: UpdateEducationRequest): Promise<ApiEnvelope<Education>> {
    return (await api.put<ApiEnvelope<Education>>(SeekerRoutes.PROFILE_EDUCATION_ID.replace(':educationId', educationId), data)).data;
  },

  async removeEducation(educationId: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(SeekerRoutes.PROFILE_EDUCATION_ID.replace(':educationId', educationId))).data;
  },

  async updateSkills(skills: string[]): Promise<ApiEnvelope<string[]>> {
    return (await api.put<ApiEnvelope<string[]>>(SeekerRoutes.PROFILE_SKILLS, { skills })).data;
  },

  async updateLanguages(languages: string[]): Promise<ApiEnvelope<string[]>> {
    return (await api.put<ApiEnvelope<string[]>>(SeekerRoutes.PROFILE_LANGUAGES, { languages })).data;
  },

  async uploadResume(data: UploadResumeRequest): Promise<ApiEnvelope<ResumeMeta>> {
    return (await api.post<ApiEnvelope<ResumeMeta>>(SeekerRoutes.PROFILE_RESUME, data)).data;
  },

  async removeResume(): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(SeekerRoutes.PROFILE_RESUME)).data;
  },

  async uploadAvatar(file: File): Promise<ApiEnvelope<SeekerProfile>> {
    return uploadFile<SeekerProfile>(SeekerRoutes.PROFILE_AVATAR, file, 'avatar');
  },

  async uploadBanner(file: File): Promise<ApiEnvelope<SeekerProfile>> {
    return uploadFile<SeekerProfile>(SeekerRoutes.PROFILE_BANNER, file, 'banner');
  }
};