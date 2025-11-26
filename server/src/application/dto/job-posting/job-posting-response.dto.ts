export interface JobPostingResponseDto {
  id: string;
  company_id: string;
  company_name?: string;
  company_logo?: string;
  title: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  nice_to_haves: string[];
  benefits: string[];
  salary: { min: number; max: number };
  employment_types: string[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  is_active: boolean;
  admin_blocked?: boolean;
  unpublish_reason?: string;
  view_count: number;
  application_count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobPostingDetailResponseDto {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  nice_to_haves: string[];
  benefits: string[];
  salary: { min: number; max: number };
  employment_types: string[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  is_active: boolean;
  admin_blocked?: boolean;
  unpublish_reason?: string;
  view_count: number;
  application_count: number;
  createdAt: string;
  updatedAt: string;
  company: {
    companyName: string;
    logo: string;
    workplacePictures: Array<{
      pictureUrl: string;
      caption?: string;
    }>;
  };
}