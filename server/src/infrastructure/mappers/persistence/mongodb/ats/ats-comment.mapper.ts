import { Types } from 'mongoose';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { IATSCommentDocument } from 'src/infrastructure/persistence/mongodb/models/ats-comment.model';

export class ATSCommentMapper {
  static toEntity(doc: IATSCommentDocument): ATSComment {
    return new ATSComment(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.comment,
      doc.stage,
      doc.subStage,
      doc.createdAt,
    );
  }

  static toDocument(comment: ATSComment): Partial<IATSCommentDocument> {
    return {
      applicationId: new Types.ObjectId(comment.applicationId),
      comment: comment.comment,
      stage: comment.stage,
      subStage: comment.subStage,
    };
  }
}

