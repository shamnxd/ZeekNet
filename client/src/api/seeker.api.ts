import { api } from './index';
import { uploadFile } from '@/shared/utils/file-upload.util';
import type { ApiEnvelope } from '@/interfaces/auth';
import { SeekerRoutes } from '@/constants/api-routes';

interface SocialLink {
  name: string;
  link: string;
}

interface ResumeMeta {
  url: string;
  fileName: string;
  uploadedAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  employmentType: string;
  location?: string;
  description?: string;
  technologies: string[];
  isCurrent: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface SeekerProfile {
  id: string;
  userId: string;
  name: string;
  headline: string | null;
  summary: string | null;
  location: string | null;
  phone: string | null;
  email: string;
  avatarUrl: string | null; 
  bannerUrl: string | null; 
  dateOfBirth: string | null;
  gender: string | null;
  skills: string[];
  languages: string[];
  socialLinks: SocialLink[];
  resume: ResumeMeta | null;
  experiences: Experience[];
  education: Education[];
  createdAt: string;
  updatedAt: string;
}

interface CreateSeekerProfileRequest {
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  skills?: string[];
  socialLinks?: SocialLink[];
}

interface UpdateSeekerProfileRequest {
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  email?: string;
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  skills?: string[];
  languages?: string[];
  socialLinks?: SocialLink[];
}

interface AddExperienceRequest {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  employmentType: string;
  location?: string;
  description?: string;
  technologies?: string[];
  isCurrent?: boolean;
}

interface UpdateExperienceRequest {
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  employmentType?: string;
  location?: string;
  description?: string;
  technologies?: string[];
  isCurrent?: boolean;
}

interface AddEducationRequest {
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

interface UpdateEducationRequest {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

interface UploadResumeRequest {
  url: string;
  fileName: string;
}

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