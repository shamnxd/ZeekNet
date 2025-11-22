import { baseApi, uploadFile } from './base.api';
import type { ApiEnvelope } from '@/interfaces/auth';

export interface SocialLink {
  name: string;
  link: string;
}

export interface ResumeMeta {
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

export interface CreateSeekerProfileRequest {
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

export interface UpdateSeekerProfileRequest {
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

export interface AddExperienceRequest {
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

export interface UpdateExperienceRequest {
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

export interface AddEducationRequest {
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface UpdateEducationRequest {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

export interface UploadResumeRequest {
  url: string;
  fileName: string;
}

export const seekerApi = {
  
  async getProfile(): Promise<ApiEnvelope<SeekerProfile>> {
    return baseApi.get<SeekerProfile>('/api/seeker/profile')();
  },

  async createProfile(data: CreateSeekerProfileRequest): Promise<ApiEnvelope<SeekerProfile>> {
    return baseApi.post<SeekerProfile>('/api/seeker/profile')(data);
  },

  async updateProfile(data: UpdateSeekerProfileRequest): Promise<ApiEnvelope<SeekerProfile>> {
    return baseApi.put<SeekerProfile>('/api/seeker/profile')(data);
  },

  async getExperiences(): Promise<ApiEnvelope<Experience[]>> {
    return baseApi.get<Experience[]>('/api/seeker/profile/experiences')();
  },

  async addExperience(data: AddExperienceRequest): Promise<ApiEnvelope<Experience>> {
    return baseApi.post<Experience>('/api/seeker/profile/experiences')(data);
  },

  async updateExperience(experienceId: string, data: UpdateExperienceRequest): Promise<ApiEnvelope<Experience>> {
    return baseApi.put<Experience>(`/api/seeker/profile/experiences/${experienceId}`)(data);
  },

  async removeExperience(experienceId: string): Promise<ApiEnvelope<{ message: string }>> {
    return baseApi.delete<{ message: string }>(`/api/seeker/profile/experiences/${experienceId}`)();
  },

  async getEducation(): Promise<ApiEnvelope<Education[]>> {
    return baseApi.get<Education[]>('/api/seeker/profile/education')();
  },

  async addEducation(data: AddEducationRequest): Promise<ApiEnvelope<Education>> {
    return baseApi.post<Education>('/api/seeker/profile/education')(data);
  },

  async updateEducation(educationId: string, data: UpdateEducationRequest): Promise<ApiEnvelope<Education>> {
    return baseApi.put<Education>(`/api/seeker/profile/education/${educationId}`)(data);
  },

  async removeEducation(educationId: string): Promise<ApiEnvelope<{ message: string }>> {
    return baseApi.delete<{ message: string }>(`/api/seeker/profile/education/${educationId}`)();
  },

  async updateSkills(skills: string[]): Promise<ApiEnvelope<string[]>> {
    return baseApi.put<string[]>('/api/seeker/profile/skills')({ skills });
  },

  async updateLanguages(languages: string[]): Promise<ApiEnvelope<string[]>> {
    return baseApi.put<string[]>('/api/seeker/profile/languages')({ languages });
  },

  async uploadResume(data: UploadResumeRequest): Promise<ApiEnvelope<ResumeMeta>> {
    return baseApi.post<ResumeMeta>('/api/seeker/profile/resume')(data);
  },

  async removeResume(): Promise<ApiEnvelope<{ message: string }>> {
    return baseApi.delete<{ message: string }>('/api/seeker/profile/resume')();
  },

  async uploadAvatar(file: File): Promise<ApiEnvelope<SeekerProfile>> {
    return uploadFile<SeekerProfile>('/api/seeker/profile/avatar', file, 'avatar');
  },

  async uploadBanner(file: File): Promise<ApiEnvelope<SeekerProfile>> {
    return uploadFile<SeekerProfile>('/api/seeker/profile/banner', file, 'banner');
  }
};