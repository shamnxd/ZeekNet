interface Salary {
  min: number;
  max: number;
}

export class JobPosting {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly responsibilities: string[],
    public readonly qualifications: string[],
    public readonly niceToHaves: string[],
    public readonly benefits: string[],
    public readonly salary: Salary,
    public readonly employmentTypes: string[],
    public readonly location: string,
    public readonly skillsRequired: string[],
    public readonly categoryIds: string[],
    public readonly status: 'active' | 'unlisted' | 'expired' | 'blocked',
    public readonly viewCount: number,
    public readonly applicationCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly companyName?: string,
    public readonly companyLogo?: string,
    public readonly unpublishReason?: string,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    title: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    niceToHaves?: string[];
    benefits?: string[];
    salary: Salary;
    employmentTypes: string[];
    location: string;
    skillsRequired: string[];
    categoryIds: string[];
    status?: 'active' | 'unlisted' | 'expired' | 'blocked';
    viewCount?: number;
    applicationCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    companyName?: string;
    companyLogo?: string;
    unpublishReason?: string;
  }): JobPosting {
    const now = new Date();
    return new JobPosting(
      data.id,
      data.companyId,
      data.title,
      data.description,
      data.responsibilities,
      data.qualifications,
      data.niceToHaves ?? [],
      data.benefits ?? [],
      data.salary,
      data.employmentTypes,
      data.location,
      data.skillsRequired,
      data.categoryIds,
      data.status ?? 'active',
      data.viewCount ?? 0,
      data.applicationCount ?? 0,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.companyName,
      data.companyLogo,
      data.unpublishReason,
    );
  }
}

export interface JobPostingFilters {
  status?: 'active' | 'unlisted' | 'expired' | 'blocked';
  categoryIds?: string[];
  employmentTypes?: string[];
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedJobPostings {
  jobs: JobPosting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}