import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { AdminDashboardStatsResponseDto } from 'src/application/dtos/admin/analytics/responses/admin-dashboard-stats-response.dto';
import { IGetAdminDashboardStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IGetAdminDashboardStatsUseCase';
import { GetAdminDashboardStatsQueryDto } from 'src/application/dtos/admin/analytics/requests/get-admin-dashboard-stats-query.dto';

import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(
    @inject(TYPES.CompanyProfileRepository) private _companyRepository: ICompanyProfileRepository,
    @inject(TYPES.SeekerProfileRepository) private _seekerRepository: ISeekerProfileRepository,
    @inject(TYPES.JobPostingRepository) private _jobRepository: IJobPostingRepository,
    @inject(TYPES.PaymentOrderRepository) private _paymentRepository: IPaymentOrderRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service,
  ) { }

  async execute(query: GetAdminDashboardStatsQueryDto): Promise<AdminDashboardStatsResponseDto> {
    const { period, startDate, endDate } = query;
    const now = new Date();

    const getRange = (): { start: Date; end: Date } | null => {
      if (period === 'all') return null;
      if (startDate && endDate) return { start: startDate, end: endDate };

      switch (period) {
      case 'day':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
        };
      case 'week':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
        };
      case 'month':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
        };
      case 'year':
        return {
          start: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
          end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
        };
      default:
        return null;
      }
    };

    const selectedRange = getRange();

    const [
      totalCompanies,
      pendingCompaniesCount,
      totalCandidates,
      totalJobs,
      activeJobs,
      unlistedJobs,
      blockedJobs,
      closedJobs,
      expiredJobs,
      earnings,
      earningsOverview,
      recentJobs,
      recentOrders,
      totalVerifiedUsers,
      pendingCompaniesData,
    ] = await Promise.all([
      selectedRange
        ? this._companyRepository.countTotalByDateRange(selectedRange.start, selectedRange.end)
        : this._companyRepository.countTotal(),
      selectedRange
        ? this._companyRepository.countByVerificationStatusAndDateRange('pending', selectedRange.start, selectedRange.end)
        : this._companyRepository.countByVerificationStatus('pending'),
      selectedRange
        ? this._userRepository.countByRoleAndDateRange('seeker', selectedRange.start, selectedRange.end)
        : this._userRepository.countByRole('seeker'),
      selectedRange
        ? this._jobRepository.countTotalByDateRange(selectedRange.start, selectedRange.end)
        : this._jobRepository.countTotal(),
      this._jobRepository.countActive(),
      this._jobRepository.countUnlisted(),
      this._jobRepository.countBlocked(),
      this._jobRepository.countClosed(),
      this._jobRepository.countExpired(),
      selectedRange
        ? this._paymentRepository.sumEarningsByDateRange(selectedRange.start, selectedRange.end)
        : this._paymentRepository.sumTotalEarnings(),
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
        unlistedJobs,
        blockedJobs,
        closedJobs,
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
