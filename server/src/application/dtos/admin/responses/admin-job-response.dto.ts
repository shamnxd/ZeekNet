export interface AdminJobListItem {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary: { min: number; max: number };
  status: string;
  applications: number;
  viewCount: number;
  createdAt: Date;
  employmentTypes: string[];
  categoryIds: string[];
}

export interface AdminJobListResponseDto {
  jobs: AdminJobListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminJobStatsResponseDto {
  total: number;
  active: number;
  inactive: number;
  totalApplications: number;
  totalViews: number;
}
