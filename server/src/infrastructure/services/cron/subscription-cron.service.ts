import cron from 'node-cron';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class SubscriptionCronService {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _jobPostingRepository: IJobPostingRepository,
  ) {}

  /**
   * Cron job to expire subscriptions
   * Runs every day at midnight
   */
  startExpireSubscriptionsCron() {
    cron.schedule('0 0 * * *', async () => {
      try {
        console.log('[CRON] Checking for expired subscriptions...');
        
        const expiredSubscriptions = await this._companySubscriptionRepository.findExpiredSubscriptions();
        
        for (const subscription of expiredSubscriptions) {
          await this._companySubscriptionRepository.deactivate(subscription.id);
          console.log(`[CRON] Deactivated subscription ${subscription.id} for company ${subscription.companyId}`);
        }
        
        console.log(`[CRON] Processed ${expiredSubscriptions.length} expired subscriptions`);
      } catch (error) {
        console.error('[CRON] Error expiring subscriptions:', error);
      }
    });
    
    console.log('[CRON] Subscription expiry cron job started');
  }

  /**
   * Cron job to expire jobs from companies with expired subscriptions
   * Runs every day at 1 AM
   */
  startExpireJobsCron() {
    cron.schedule('0 1 * * *', async () => {
      try {
        console.log('[CRON] Checking for jobs to expire...');
        
        const expiredSubscriptions = await this._companySubscriptionRepository.findExpiredSubscriptions();
        let totalJobsExpired = 0;
        
        for (const subscription of expiredSubscriptions) {
          // Get all active jobs for this company
          const jobs = await this._jobPostingRepository.getJobsByCompany(
            subscription.companyId,
            { status: 1, _id: 1 },
          );
          
          const activeJobs = jobs.filter((job: Partial<JobPosting>) => job.status === 'active');
          
          // Expire all active jobs
          for (const job of activeJobs) {
            if (job.id) {
              await this._jobPostingRepository.update(job.id, {
                status: 'expired',
              });
              totalJobsExpired++;
            }
          }
          
          console.log(`[CRON] Expired ${activeJobs.length} jobs for company ${subscription.companyId}`);
        }
        
        console.log(`[CRON] Total jobs expired: ${totalJobsExpired}`);
      } catch (error) {
        console.error('[CRON] Error expiring jobs:', error);
      }
    });
    
    console.log('[CRON] Job expiry cron job started');
  }

  /**
   * Start all cron jobs
   */
  startAll() {
    this.startExpireSubscriptionsCron();
    this.startExpireJobsCron();
  }
}
