import { ApplicationStage } from '../enums/application-stage.enum';
import { InterviewStatus, InterviewFeedback, InterviewSchedule } from '../interfaces/interview.interfaces';

export { ApplicationStage, InterviewFeedback, InterviewSchedule, InterviewStatus };

export class JobApplication {
  constructor(
    public readonly id: string,
    public readonly seekerId: string,
    public readonly jobId: string,
    public readonly companyId: string,
    public readonly coverLetter: string,
    public readonly resumeUrl: string,
    public readonly resumeFilename: string,
    public readonly stage: ApplicationStage,
    public readonly interviews: InterviewSchedule[],
    public readonly appliedDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly score?: number,
    public readonly rejectionReason?: string,
  ) {}

  static create(data: {
    id: string;
    seekerId: string;
    jobId: string;
    companyId: string;
    coverLetter: string;
    resumeUrl: string;
    resumeFilename: string;
    stage?: ApplicationStage;
    interviews?: InterviewSchedule[];
    appliedDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    score?: number;
    rejectionReason?: string;
  }): JobApplication {
    const now = new Date();
    return new JobApplication(
      data.id,
      data.seekerId,
      data.jobId,
      data.companyId,
      data.coverLetter,
      data.resumeUrl,
      data.resumeFilename,
      data.stage ?? ApplicationStage.APPLIED,
      data.interviews ?? [],
      data.appliedDate ?? now,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.score,
      data.rejectionReason,
    );
  }
}


