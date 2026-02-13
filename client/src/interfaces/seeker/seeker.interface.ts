
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
  _id?: string;
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
  _id?: string;
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
