export interface CompanyDashboardStats {
  activeJobs: number;
  totalJobs: number;
  totalApplications: number;
  upcomingInterviews: number;
  unreadMessages: number;
  newCandidatesCount: number;
  todayInterviews: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    interviewTitle: string;
    interviewType: string;
    scheduledTime: string;
    status: string;
    seekerProfileImage?: string;
  }>;
}

export interface IGetCompanyDashboardStatsUseCase {
  execute(userId: string): Promise<CompanyDashboardStats>;
}
