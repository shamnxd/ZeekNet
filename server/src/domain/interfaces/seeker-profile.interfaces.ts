export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
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
  startDate: Date;
  endDate?: Date;
  grade?: string;
}

export interface ResumeMeta {
  url: string;
  fileName: string;
  uploadedAt: Date;
}

export interface SocialLink {
  name: string;
  link: string;
}
