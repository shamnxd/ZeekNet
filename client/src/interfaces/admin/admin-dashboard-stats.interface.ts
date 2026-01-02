export interface AdminDashboardStats {
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
    popularLocation: { name: string; percentage: number }[];
  };
  recentJobs: {
    title: string;
    experience: string;
    jobType: string;
    companyName: string;
    postedAt: string;
  }[];
  recentOrders: {
    orderNo: string;
    amount: number;
    planName: string;
    paymentProvider: string;
    paymentStatus: string;
    createdTime: string;
  }[];
}
