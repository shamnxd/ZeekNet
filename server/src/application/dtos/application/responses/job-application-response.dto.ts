import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface JobApplicationResponseDto {
  id: string;
  seekerId: string;
  jobId: string;
  companyId: string;
  coverLetter: string;
  resumeUrl: string;
  resumeFilename: string;
  stage: ATSStage;
  subStage: ATSSubStage;
  score?: number;
  atsScore?: number;
  appliedDate: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
