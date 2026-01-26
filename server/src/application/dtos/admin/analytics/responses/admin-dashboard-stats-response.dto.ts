export class AdminDashboardStatsResponseDto {
  stats: {
    earnings: number;
    totalCandidates: number;
    totalCompanies: number;
    totalVerifiedUsers: number;
    activeJobs: number;
    expiredJobs: number;
    pendingCompanies: number;
    allJobs: number;
  };
  charts: {
    earningsOverview: { label: string; value: number }[];
  };
  pendingCompanies: {
    id: string;
    companyName: string;
    logo: string;
    industry: string;
  }[];
  recentJobs: {
    id: string;
    title: string;
    experience: string;
    jobType: string;
    companyName: string;
    postedAt: Date;
  }[];
  recentOrders: {
    orderNo: string;
    amount: number;
    planName: string;
    paymentProvider: string;
    paymentStatus: string;
    createdTime: Date;
  }[];
}
