import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAtsService } from 'src/domain/interfaces/services/IAtsService';
import { ILogger } from 'src/domain/interfaces/services/ILogger';

export interface CalculateATSScoreInput {
  applicationId: string;
  jobDetails: {
    title: string;
    description: string;
    qualifications?: string[];
    responsibilities?: string[];
    skillsRequired: string[];
  };
  candidateData: {
    coverLetter: string;
    resumeText?: string;
  };
}

export interface ICalculateATSScoreUseCase {
  execute(input: CalculateATSScoreInput): Promise<void>;
}


import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CalculateATSScoreUseCase implements ICalculateATSScoreUseCase {
  constructor(
    @inject(TYPES.JobApplicationRepository) private readonly _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.AtsService) private readonly _atsService: IAtsService,
    @inject(TYPES.LoggerService) private readonly _logger: ILogger,
  ) { }

  async execute(input: CalculateATSScoreInput): Promise<void> {
    const { applicationId, jobDetails, candidateData } = input;

    try {
      const atsResult = await this._atsService.calculateATSScore(jobDetails, candidateData);

      await this._jobApplicationRepository.update(applicationId, {
        score: atsResult.score,
      });

      this._logger.info(`ATS score calculated for application ${applicationId}: ${atsResult.score}`);
    } catch (error) {
      this._logger.error(`Failed to calculate ATS score for application ${applicationId}:`, error);


      await this._jobApplicationRepository.update(applicationId, {
        score: undefined,
      });
    }
  }
}
