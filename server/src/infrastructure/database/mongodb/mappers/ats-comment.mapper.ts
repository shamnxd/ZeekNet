import { Types } from 'mongoose';
import { ATSComment } from '../../../../domain/entities/ats-comment.entity';
import { IATSCommentDocument } from '../models/ats-comment.model';

export class ATSCommentMapper {
  static toEntity(doc: IATSCommentDocument): ATSComment {
    return new ATSComment(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.comment,
      doc.addedBy.toString(),
      doc.addedByName,
      doc.stage,
      doc.subStage,
      doc.createdAt,
    );
  }

  static toDocument(comment: ATSComment): Partial<IATSCommentDocument> {
    return {
      applicationId: new Types.ObjectId(comment.applicationId),
      comment: comment.comment,
      addedBy: new Types.ObjectId(comment.addedBy),
      addedByName: comment.addedByName,
      stage: comment.stage,
      subStage: comment.subStage,
    };
  }
}
