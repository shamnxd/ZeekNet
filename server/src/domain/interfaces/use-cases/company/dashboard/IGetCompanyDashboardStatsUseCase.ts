export interface CompanyDashboardStats {
  activeJobs: number;
  totalJobs: number;
  totalApplications: number;
  upcomingInterviews: number;
  unreadMessages: number;
}

export interface IGetCompanyDashboardStatsUseCase {
  execute(userId: string): Promise<CompanyDashboardStats>;
}
