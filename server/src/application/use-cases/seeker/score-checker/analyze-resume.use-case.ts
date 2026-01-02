import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAnalyzeResumeUseCase } from 'src/domain/interfaces/use-cases/seeker/score-checker/IAnalyzeResumeUseCase';
import { ATSScoreResult } from 'src/domain/types/ats.types';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { IAtsService } from 'src/domain/interfaces/services/IAtsService';
import { IResumeParserService } from 'src/domain/interfaces/services/IResumeParserService';

export class AnalyzeResumeUseCase implements IAnalyzeResumeUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _atsService: IAtsService,
    private readonly _resumeParserService: IResumeParserService,
  ) {}

  async execute(jobId: string, resumeBuffer: Buffer, mimeType: string): Promise<ATSScoreResult> {
    const job = await this._jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    let resumeText = '';

    try {
      resumeText = await this._resumeParserService.parse(resumeBuffer, mimeType);
    } catch (error) {
      throw error; 
    }

    if (!resumeText || !resumeText.trim()) {
      throw new ValidationError('Could not extract text from the resume. The file might be empty or scanned image.');
    }

    return this._atsService.calculateATSScore(
      {
        title: job.title,
        description: job.description,
        qualifications: job.qualifications,
        responsibilities: job.responsibilities,
        skillsRequired: job.skillsRequired,

      },
      {
        coverLetter: 'No cover letter provided for this analysis.',
        resumeText: resumeText,
      },
    );
  }
}
