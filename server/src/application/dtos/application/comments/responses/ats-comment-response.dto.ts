import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface ATSCommentResponseDto {
  id: string;
  applicationId: string;
  comment: string;
  stage: ATSStage;
  subStage?: ATSSubStage;
  createdAt: Date;
  updatedAt: Date;
}

