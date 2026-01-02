import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { GetCompanyIdByUserIdUseCase } from 'src/application/use-cases/admin/companies/get-company-id-by-user-id.use-case';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { CompanyDashboardStatsDto } from 'src/application/dtos/company/requests/get-company-dashboard-stats.dto';
import { Types } from 'mongoose';

export class GetCompanyDashboardStatsUseCase {
  constructor(
    private jobPostingRepository: IJobPostingRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private atsInterviewRepository: IATSInterviewRepository,
    private chatMessageRepository: IMessageRepository,
    private getCompanyIdByUserIdUseCase: GetCompanyIdByUserIdUseCase,
  ) {}

  async execute(userId: string, period: 'week' | 'month' = 'week'): Promise<CompanyDashboardStatsDto> {
    const companyId = await this.getCompanyIdByUserIdUseCase.execute(userId);
    
    // Fetch all jobs for the company
    const companyJobs = await this.jobPostingRepository.getJobsByCompany(companyId, {});
    
    // Efficiently fetch all applications for the company using the company_id field
    // We use findMany which is available in RepositoryBase
    const flatApplications = await this.jobApplicationRepository.findMany({ 
      company_id: new Types.ObjectId(companyId) 
    });

    const now = new Date();
    const periodDays = period === 'week' ? 7 : 30;
    const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(now.getTime() - 2 * periodDays * 24 * 60 * 60 * 1000);

    // New candidates are those in APPLIED or IN_REVIEW stage within the current period
    const newCandidates = flatApplications.filter(
      app => (app.stage === ATSStage.APPLIED || app.stage === ATSStage.IN_REVIEW) && 
             app.appliedDate && 
             new Date(app.appliedDate) >= periodStart
    ).length;

    const applicationIds = flatApplications.map(app => app.id).filter((id): id is string => id !== undefined);
    
    // Fetch interviews for today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // We can optimize this if we had findByApplicationIds, but for now we follow the existing pattern
    const allInterviews = await Promise.all(
      applicationIds.map(appId => this.atsInterviewRepository.findByApplicationId(appId))
    );
    const flatInterviews = allInterviews.flat();
    
    const scheduledToday = flatInterviews.filter(interview => {
      if (!interview.scheduledDate || interview.status === 'cancelled') return false;
      const interviewDate = new Date(interview.scheduledDate);
      return interviewDate >= todayStart && interviewDate <= todayEnd;
    }).length;

    const messagesReceived = await this.chatMessageRepository.countByReceiverId(userId, periodStart);

    const jobsOpen = companyJobs.filter(job => job.status === 'active').length;
    const totalApplicants = flatApplications.length;

    const totalJobViews = companyJobs.reduce((sum, job) => sum + (job.viewCount || 0), 0);

    const currentPeriodApplications = flatApplications.filter(
      app => app.appliedDate && new Date(app.appliedDate) >= periodStart
    ).length;

    const previousPeriodApplications = flatApplications.filter(
      app => app.appliedDate && 
      new Date(app.appliedDate) >= previousPeriodStart && 
      new Date(app.appliedDate) < periodStart
    ).length;

    const appliedPercentageChange = previousPeriodApplications > 0
      ? ((currentPeriodApplications - previousPeriodApplications) / previousPeriodApplications) * 100
      : 0;

    // Daily statistics for the chart
    const jobStats = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartDays = period === 'week' ? 7 : 14; 
    
    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayApplications = flatApplications.filter(app => {
        if (!app.appliedDate) return false;
        const appDate = new Date(app.appliedDate);
        return appDate >= date && appDate < nextDate;
      }).length;

      jobStats.push({
        day: days[date.getDay()],
        views: 0, // Daily view tracking not yet implemented
        applied: dayApplications
      });
    }

    const applicantsByType = {
      fullTime: 0,
      partTime: 0,
      remote: 0,
      internship: 0,
      contract: 0
    };

    flatApplications.forEach(app => {
      const job = companyJobs.find(j => j.id === app.jobId);
      if (job && job.employmentTypes && job.employmentTypes.length > 0) {
        const type = job.employmentTypes[0].toLowerCase();
        if (type.includes('full')) applicantsByType.fullTime++;
        else if (type.includes('part')) applicantsByType.partTime++;
        else if (type.includes('remote')) applicantsByType.remote++;
        else if (type.includes('intern')) applicantsByType.internship++;
        else if (type.includes('contract')) applicantsByType.contract++;
      }
    });

    const recentJobs = companyJobs
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4)
      .map(job => {
        const jobApplications = flatApplications.filter(app => app.jobId === job.id);
        const hiredCount = jobApplications.filter(app => app.stage === ATSStage.HIRED).length;
        return {
          id: job.id || '',
          title: job.title || '',
          location: job.location || '',
          employmentType: job.employmentTypes?.[0] || 'Full-time',
          appliedCount: jobApplications.length,
          hiredCount,
          totalVacancies: job.totalVacancies || 1
        };
      });

    return {
      stats: {
        newCandidates,
        scheduledToday,
        messagesReceived,
        jobsOpen,
        totalApplicants,
        jobViews: {
          total: totalJobViews,
          percentageChange: 0 
        },
        jobApplied: {
          total: currentPeriodApplications,
          percentageChange: appliedPercentageChange
        }
      },
      charts: {
        jobStats
      },
      applicantsByType,
      recentJobs
    };
  }
}
