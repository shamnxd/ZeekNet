export class CompanyDashboardStatsDto {
  stats: {
    newCandidates: number;
    scheduledToday: number;
    messagesReceived: number;
    jobsOpen: number;
    totalApplicants: number;
    jobViews: {
      total: number;
      percentageChange: number;
    };
    jobApplied: {
      total: number;
      percentageChange: number;
    };
  };
  charts: {
    jobStats: { day: string; views: number; applied: number }[];
  };
  applicantsByType: {
    fullTime: number;
    partTime: number;
    remote: number;
    internship: number;
    contract: number;
  };
  recentJobs: {
    id: string;
    title: string;
    location: string;
    employmentType: string;
    appliedCount: number;
    hiredCount: number;
    totalVacancies: number;
  }[];
}
