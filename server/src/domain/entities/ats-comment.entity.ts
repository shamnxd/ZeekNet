import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export class ATSComment {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly comment: string,
    public readonly stage: ATSStage,
    public readonly subStage?: ATSSubStage,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) { }

  static create(data: {
    id: string;
    applicationId: string;
    comment: string;
    stage: ATSStage;
    subStage?: ATSSubStage;
    createdAt?: Date;
    updatedAt?: Date;
  }): ATSComment {
    return new ATSComment(
      data.id,
      data.applicationId,
      data.comment,
      data.stage,
      data.subStage,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
