import { Types } from 'mongoose';
import { ATSTechnicalTask } from '../../../../domain/entities/ats-technical-task.entity';
import { IATSTechnicalTaskDocument } from '../models/ats-technical-task.model';

export class ATSTechnicalTaskMapper {
  static toDomain(doc: IATSTechnicalTaskDocument): ATSTechnicalTask {
    return new ATSTechnicalTask(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.title,
      doc.description,
      doc.deadline,
      doc.documentUrl,
      doc.documentFilename,
      doc.submissionUrl,
      doc.submissionFilename,
      doc.submissionLink,
      doc.submissionNote,
      doc.submittedAt,
      doc.status,
      doc.rating,
      doc.feedback,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(task: ATSTechnicalTask): Partial<IATSTechnicalTaskDocument> {
    return {
      applicationId: new Types.ObjectId(task.applicationId),
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      documentUrl: task.documentUrl,
      documentFilename: task.documentFilename,
      submissionUrl: task.submissionUrl,
      submissionFilename: task.submissionFilename,
      submissionLink: task.submissionLink,
      submissionNote: task.submissionNote,
      submittedAt: task.submittedAt,
      status: task.status,
      rating: task.rating,
      feedback: task.feedback,
    };
  }
}
