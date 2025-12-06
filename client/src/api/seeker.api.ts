import { api } from './index';
import { uploadFile } from '@/shared/utils/file-upload.util';
import type { ApiEnvelope } from '@/interfaces/auth';

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
    return (await api.get<ApiEnvelope<SeekerProfile>>('/api/seeker/profile')).data;
  },

  async createProfile(data: CreateSeekerProfileRequest): Promise<ApiEnvelope<SeekerProfile>> {
    return (await api.post<ApiEnvelope<SeekerProfile>>('/api/seeker/profile', data)).data;
  },

  async updateProfile(data: UpdateSeekerProfileRequest): Promise<ApiEnvelope<SeekerProfile>> {
    return (await api.put<ApiEnvelope<SeekerProfile>>('/api/seeker/profile', data)).data;
  },

  async getExperiences(): Promise<ApiEnvelope<Experience[]>> {
    return (await api.get<ApiEnvelope<Experience[]>>('/api/seeker/profile/experiences')).data;
  },

  async addExperience(data: AddExperienceRequest): Promise<ApiEnvelope<Experience>> {
    return (await api.post<ApiEnvelope<Experience>>('/api/seeker/profile/experiences', data)).data;
  },

  async updateExperience(experienceId: string, data: UpdateExperienceRequest): Promise<ApiEnvelope<Experience>> {
    return (await api.put<ApiEnvelope<Experience>>(`/api/seeker/profile/experiences/${experienceId}`, data)).data;
  },

  async removeExperience(experienceId: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(`/api/seeker/profile/experiences/${experienceId}`)).data;
  },

  async getEducation(): Promise<ApiEnvelope<Education[]>> {
    return (await api.get<ApiEnvelope<Education[]>>('/api/seeker/profile/education')).data;
  },

  async addEducation(data: AddEducationRequest): Promise<ApiEnvelope<Education>> {
    return (await api.post<ApiEnvelope<Education>>('/api/seeker/profile/education', data)).data;
  },

  async updateEducation(educationId: string, data: UpdateEducationRequest): Promise<ApiEnvelope<Education>> {
    return (await api.put<ApiEnvelope<Education>>(`/api/seeker/profile/education/${educationId}`, data)).data;
  },

  async removeEducation(educationId: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(`/api/seeker/profile/education/${educationId}`)).data;
  },

  async updateSkills(skills: string[]): Promise<ApiEnvelope<string[]>> {
    return (await api.put<ApiEnvelope<string[]>>('/api/seeker/profile/skills', { skills })).data;
  },

  async updateLanguages(languages: string[]): Promise<ApiEnvelope<string[]>> {
    return (await api.put<ApiEnvelope<string[]>>('/api/seeker/profile/languages', { languages })).data;
  },

  async uploadResume(data: UploadResumeRequest): Promise<ApiEnvelope<ResumeMeta>> {
    return (await api.post<ApiEnvelope<ResumeMeta>>('/api/seeker/profile/resume', data)).data;
  },

  async removeResume(): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>('/api/seeker/profile/resume')).data;
  },

  async uploadAvatar(file: File): Promise<ApiEnvelope<SeekerProfile>> {
    return uploadFile<SeekerProfile>('/api/seeker/profile/avatar', file, 'avatar');
  },

  async uploadBanner(file: File): Promise<ApiEnvelope<SeekerProfile>> {
    return uploadFile<SeekerProfile>('/api/seeker/profile/banner', file, 'banner');
  }
};