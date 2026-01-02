import { Types } from 'mongoose';
import { ATSInterview } from '../../../../domain/entities/ats-interview.entity';
import { IATSInterviewDocument } from '../models/ats-interview.model';

export class ATSInterviewMapper {
  static toDomain(doc: IATSInterviewDocument): ATSInterview {
    return new ATSInterview(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.title,
      doc.scheduledDate,
      doc.type,
      doc.videoType,
      doc.webrtcRoomId,
      doc.meetingLink,
      doc.location,
      doc.status,
      doc.rating,
      doc.feedback,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(interview: ATSInterview): Partial<IATSInterviewDocument> {
    return {
      applicationId: new Types.ObjectId(interview.applicationId),
      title: interview.title,
      scheduledDate: interview.scheduledDate,
      type: interview.type,
      videoType: interview.videoType,
      webrtcRoomId: interview.webrtcRoomId,
      meetingLink: interview.meetingLink,
      location: interview.location,
      status: interview.status,
      rating: interview.rating,
      feedback: interview.feedback,
    };
  }
}
