export interface IGetPublicCompanyJobsUseCase {
  execute(companyId: string, page?: number, limit?: number): Promise<{
    jobs: Array<{
      id: string;
      title: string;
      location: string;
      salary: { min: number; max: number };
      employmentTypes: string[];
      createdAt: Date;
    }>;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }>;
}
