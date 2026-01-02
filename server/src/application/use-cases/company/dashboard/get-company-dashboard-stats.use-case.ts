import { IGetCompanyDashboardStatsUseCase, CompanyDashboardStats } from 'src/domain/interfaces/use-cases/company/dashboard/IGetCompanyDashboardStatsUseCase';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export class GetCompanyDashboardStatsUseCase implements IGetCompanyDashboardStatsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _atsInterviewRepository: IATSInterviewRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(userId: string): Promise<CompanyDashboardStats> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

    const activeJobs = await this._jobPostingRepository.countDocuments({
      companyId: companyId,
      status: JobStatus.ACTIVE,
    }); // Assuming countDocuments works with Partial<JobPosting>

    const totalJobs = await this._jobPostingRepository.countDocuments({
      companyId: companyId,
    });

    // Assuming JobApplication has companyId
    const totalApplications = await this._jobApplicationRepository.countDocuments({
      companyId: companyId,
    });

    // Unread messages for the user
    // Assuming readAt is null for unread
    const unreadMessages = await this._messageRepository.countDocuments({
      receiverId: userId,
      readAt: null,
    });

    // Upcoming Interviews - Mocking for now as repo doesn't support complex query
    // In a real app, we would add countUpcomingByCompany(companyId) to Repo
    const upcomingInterviews = 0; 

    return {
      activeJobs,
      totalJobs,
      totalApplications,
      upcomingInterviews,
      unreadMessages,
    };
  }
}
