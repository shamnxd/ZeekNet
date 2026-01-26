import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { AdminDashboardStatsResponseDto } from 'src/application/dtos/admin/analytics/responses/admin-dashboard-stats-response.dto';
import { IGetAdminDashboardStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IGetAdminDashboardStatsUseCase';
import { GetAdminDashboardStatsQueryDto } from 'src/application/dtos/admin/analytics/requests/get-admin-dashboard-stats-query.dto';

import { IS3Service } from 'src/domain/interfaces/services/IS3Service';

export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(
    private _companyRepository: ICompanyProfileRepository,
    private _seekerRepository: ISeekerProfileRepository,
    private _jobRepository: IJobPostingRepository,
    private _paymentRepository: IPaymentOrderRepository,
    private _userRepository: IUserRepository,
    private _s3Service: IS3Service,
  ) { }

  async execute(query: GetAdminDashboardStatsQueryDto): Promise<AdminDashboardStatsResponseDto> {
    const { period, startDate, endDate } = query;
    const [
      totalCompanies,
      pendingCompaniesCount,
      totalCandidates,
      totalJobs,
      activeJobs,
      expiredJobs,
      earnings,
      earningsOverview,
      recentJobs,
      recentOrders,
      totalVerifiedUsers,
      pendingCompaniesData,
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
      this._userRepository.countVerified(),
      this._companyRepository.getAllCompanies({ page: 1, limit: 5, isVerified: 'pending' }),
    ]);

    return {
      stats: {
        earnings,
        totalCandidates,
        totalCompanies,
        totalVerifiedUsers,
        activeJobs,
        expiredJobs,
        pendingCompanies: pendingCompaniesCount,
        allJobs: totalJobs,
      },
      charts: {
        earningsOverview,
      },
      pendingCompanies: await Promise.all(
        pendingCompaniesData.companies.map(async (c) => {
          let logo = c.logo || '';
          if (logo && !logo.startsWith('http')) {
            try {
              logo = await this._s3Service.getSignedUrl(logo);
            } catch (error) {
              console.error(`Failed to sign logo for company ${c.id}:`, error);
            }
          }
          return {
            id: c.id,
            companyName: c.companyName,
            logo,
            industry: c.industry || 'Other',
          };
        }),
      ),
      recentJobs: recentJobs.map(job => ({
        id: job.id,
        title: job.title,
        experience: 'Not specified',
        jobType: job.employmentTypes?.[0] || 'Full-time',
        companyName: job.companyName || 'Unknown',
        postedAt: job.createdAt || new Date(),
      })),
      recentOrders: recentOrders.map(order => ({
        orderNo: `#${(order.id || '').slice(0, 8)}`,
        amount: order.amount,
        planName: 'Standard Plan',
        paymentProvider: 'Stripe',
        paymentStatus: order.status,
        createdTime: order.createdAt || new Date(),
      })),
    };
  }
}
