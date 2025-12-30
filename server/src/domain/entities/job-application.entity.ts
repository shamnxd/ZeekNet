import { ATSStage, ATSSubStage, InReviewSubStage } from '../enums/ats-stage.enum';

export class JobApplication {
  constructor(
    public readonly id: string,
    public readonly seekerId: string,
    public readonly jobId: string,
    public readonly companyId: string,
    public readonly coverLetter: string,
    public readonly resumeUrl: string,
    public readonly resumeFilename: string,
    public readonly stage: ATSStage,
    public readonly subStage: ATSSubStage,
    public readonly atsScore?: number,
    public readonly appliedDate: Date = new Date(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
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
    stage?: ATSStage;
    subStage?: ATSSubStage;
    atsScore?: number;
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
      data.stage ?? ATSStage.IN_REVIEW,
      data.subStage ?? InReviewSubStage.PROFILE_REVIEW,
      data.atsScore,
      data.appliedDate ?? now,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.score,
      data.rejectionReason,
    );
  }
}
