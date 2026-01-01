import { Document, Types } from 'mongoose';
import { ATSActivity } from '../../../../../domain/entities/ats-activity.entity';
import { IATSActivityDocument } from '../../models/ats-activity.model';

export class ATSActivityMapper {
  static toEntity(doc: IATSActivityDocument & Document): ATSActivity {
    return new ATSActivity(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.type,
      doc.title,
      doc.description,
      doc.performedBy.toString(),
      doc.performedByName,
      doc.stage,
      doc.subStage,
      doc.metadata,
      doc.createdAt,
    );
  }

  static toDocument(activity: ATSActivity): Partial<IATSActivityDocument> {
    return {
      applicationId: new Types.ObjectId(activity.applicationId),
      type: activity.type,
      title: activity.title,
      description: activity.description,
      performedBy: new Types.ObjectId(activity.performedBy),
      performedByName: activity.performedByName,
      stage: activity.stage,
      subStage: activity.subStage,
      metadata: activity.metadata,
    };
  }
}

