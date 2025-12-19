import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAnalyzeResumeUseCase } from '../../../domain/interfaces/use-cases/applications/IAnalyzeResumeUseCase';
import { groqService, ATSScoreResult } from '../../../infrastructure/services/groq.service';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { ResumeParser } from '../../../shared/utils/resume-parser.utils';

export class AnalyzeResumeUseCase implements IAnalyzeResumeUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, resumeBuffer: Buffer, mimeType: string): Promise<ATSScoreResult> {
    const job = await this._jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    let resumeText = '';

    try {
      resumeText = await ResumeParser.parse(resumeBuffer, mimeType);
    } catch (error) {
      throw error; 
    }

    if (!resumeText || !resumeText.trim()) {
      throw new ValidationError('Could not extract text from the resume. The file might be empty or scanned image.');
    }

    return groqService.calculateATSScore(
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
