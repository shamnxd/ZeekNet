import { IGetCompanyDashboardStatsUseCase, CompanyDashboardStats } from 'src/domain/interfaces/use-cases/company/dashboard/IGetCompanyDashboardStatsUseCase';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { ATSInterviewModel } from 'src/infrastructure/persistence/mongodb/models/ats-interview.model';
import { JobApplicationModel } from 'src/infrastructure/persistence/mongodb/models/job-application.model';
import { Types } from 'mongoose';

export class GetCompanyDashboardStatsUseCase implements IGetCompanyDashboardStatsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _atsInterviewRepository: IATSInterviewRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) { }

  async execute(userId: string): Promise<CompanyDashboardStats> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

    const activeJobs = await this._jobPostingRepository.countDocuments({
      company_id: companyId,
      status: JobStatus.ACTIVE,
    });

    const totalJobs = await this._jobPostingRepository.countDocuments({
      company_id: companyId,
    });

    const totalApplications = await this._jobApplicationRepository.countDocuments({
      company_id: companyId,
    });

    // Count new candidates (applications in IN_REVIEW or APPLIED stage)
    const newCandidatesCount = await JobApplicationModel.countDocuments({
      company_id: new Types.ObjectId(companyId),
      stage: { $in: [ATSStage.IN_REVIEW, ATSStage.APPLIED] },
    });

    // Count upcoming interviews/meetings for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get all applications for this company to find their interview IDs
    const companyApplications = await JobApplicationModel.find({
      company_id: new Types.ObjectId(companyId),
    }).select('_id').lean();

    const applicationIds = companyApplications.map(app => app._id);

    const upcomingInterviews = await ATSInterviewModel.countDocuments({
      applicationId: { $in: applicationIds },
      status: 'scheduled',
      scheduledDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    // Unread messages for the user
    const unreadMessages = await this._messageRepository.countDocuments({
      receiver_id: userId,
      read_at: null,
    });

    return {
      activeJobs,
      totalJobs,
      totalApplications,
      upcomingInterviews,
      unreadMessages,
      newCandidatesCount,
    };
  }
}
