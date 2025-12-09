
export interface UpdateJobPostingData {
  jobId?: string;
  title?: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  nice_to_haves?: string[];
  benefits?: string[];
  salary?: {
    min: number;
    max: number;
  };
  employment_types?: string[];
  location?: string;
  skills_required?: string[];
  category_ids?: string[];
  is_active?: boolean;
  is_featured?: boolean;
}
