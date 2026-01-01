import { ActivityType, ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export class ATSActivity {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly type: ActivityType,
    public readonly title: string,
    public readonly description: string,
    public readonly performedBy: string,
    public readonly performedByName: string,
    public readonly stage?: ATSStage,
    public readonly subStage?: ATSSubStage,
    public readonly metadata?: Record<string, unknown>,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(data: {
    id: string;
    applicationId: string;
    type: ActivityType;
    title: string;
    description: string;
    performedBy: string;
    performedByName: string;
    stage?: ATSStage;
    subStage?: ATSSubStage;
    metadata?: Record<string, unknown>;
    createdAt?: Date;
  }): ATSActivity {
    return new ATSActivity(
      data.id,
      data.applicationId,
      data.type,
      data.title,
      data.description,
      data.performedBy,
      data.performedByName,
      data.stage,
      data.subStage,
      data.metadata,
      data.createdAt ?? new Date(),
    );
  }
}
