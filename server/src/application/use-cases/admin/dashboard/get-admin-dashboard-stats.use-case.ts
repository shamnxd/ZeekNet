import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { AdminDashboardStatsResponseDto } from 'src/application/dtos/admin/analytics/responses/admin-dashboard-stats-response.dto';
import { IGetAdminDashboardStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IGetAdminDashboardStatsUseCase';
import { GetAdminDashboardStatsQueryDto } from 'src/application/dtos/admin/analytics/requests/get-admin-dashboard-stats-query.dto';

export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(
    private _companyRepository: ICompanyProfileRepository,
    private _seekerRepository: ISeekerProfileRepository,
    private _jobRepository: IJobPostingRepository,
    private _paymentRepository: IPaymentOrderRepository,
    private _userRepository: IUserRepository,
  ) {}

  async execute(query: GetAdminDashboardStatsQueryDto): Promise<AdminDashboardStatsResponseDto> {
    const { period, startDate, endDate } = query;
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
      this._companyRepository.countTotal(),
      this._companyRepository.countByVerificationStatus('pending'),
      this._userRepository.countByRole('seeker'),
      this._jobRepository.countTotal(),
      this._jobRepository.countActive(),
      this._jobRepository.countExpired(),
      this._paymentRepository.sumTotalEarnings(),
      this._paymentRepository.getEarningsByPeriod(period, startDate, endDate),
      this._jobRepository.findRecent(5),
      this._paymentRepository.findRecent(5),
      this._userRepository.countVerified()
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
