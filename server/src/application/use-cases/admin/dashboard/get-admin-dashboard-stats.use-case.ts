import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { AdminDashboardStatsDto } from './dto/get-admin-dashboard-stats.dto';

export class GetAdminDashboardStatsUseCase {
  constructor(
    private companyRepository: ICompanyProfileRepository,
    private seekerRepository: ISeekerProfileRepository,
    private jobRepository: IJobPostingRepository,
    private paymentRepository: IPaymentOrderRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(period: 'day' | 'week' | 'month' | 'year' = 'month', startDate?: Date, endDate?: Date): Promise<AdminDashboardStatsDto> {
    const [
      totalCompanies,
      pendingCompanies,
      totalCandidates,
      totalJobs,
      activeJobs,
      expiredJobs,
      earnings,
      earningsOverview,
      recentJobs,
      recentOrders,
      totalVerifiedUsers
    ] = await Promise.all([
      this.companyRepository.countTotal(),
      this.companyRepository.countByVerificationStatus('pending'),
      this.userRepository.countByRole('seeker'),
      this.jobRepository.countTotal(),
      this.jobRepository.countActive(),
      this.jobRepository.countExpired(),
      this.paymentRepository.sumTotalEarnings(),
      this.paymentRepository.getEarningsByPeriod(period, startDate, endDate),
      this.jobRepository.findRecent(5),
      this.paymentRepository.findRecent(5),
      this.userRepository.countVerified()
    ]);

    // Mock Location Data (since we don't have real location aggregation yet)
    const popularLocation = [
      { name: 'United States', percentage: 25 },
      { name: 'United Kingdom', percentage: 18 },
      { name: 'India', percentage: 15 },
      { name: 'Canada', percentage: 12 },
      { name: 'Germany', percentage: 10 }
    ];

    return {
      stats: {
        earnings,
        totalCandidates,
        totalCompanies,
        totalVerifiedUsers,
        activeJobs,
        expiredJobs,
        pendingCompanies,
        allJobs: totalJobs
      },
      charts: {
        earningsOverview,
        popularLocation
      },
      recentJobs: recentJobs.map(job => ({
        title: job.title,
        experience: 'Not specified', 
        jobType: job.employmentTypes?.[0] || 'Full-time',
        companyName: job.companyName || 'Unknown',
        postedAt: job.createdAt || new Date()
      })),
      recentOrders: recentOrders.map(order => ({
        orderNo: `#${(order.id || '').slice(0, 8)}`,
        amount: order.amount,
        planName: 'Standard Plan',
        paymentProvider: 'Stripe',
        paymentStatus: order.status,
        createdTime: order.createdAt || new Date()
      }))
    };
  }
}
