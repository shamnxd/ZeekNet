import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export class ATSComment {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly comment: string,
    public readonly addedBy: string,
    public readonly addedByName: string,
    public readonly stage: ATSStage,
    public readonly subStage?: ATSSubStage,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(data: {
    id: string;
    applicationId: string;
    comment: string;
    addedBy: string;
    addedByName: string;
    stage: ATSStage;
    subStage?: ATSSubStage;
    createdAt?: Date;
  }): ATSComment {
    return new ATSComment(
      data.id,
      data.applicationId,
      data.comment,
      data.addedBy,
      data.addedByName,
      data.stage,
      data.subStage,
      data.createdAt ?? new Date(),
    );
  }
}
