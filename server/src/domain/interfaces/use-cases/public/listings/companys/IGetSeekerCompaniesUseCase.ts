export interface IGetSeekerCompaniesUseCase {
  execute(options: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
  }): Promise<{
    companies: Array<{
      id: string;
      companyName: string;
      logo: string;
      industry: string;
      aboutUs: string;
      activeJobCount: number;
      hasActiveSubscription: boolean;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
