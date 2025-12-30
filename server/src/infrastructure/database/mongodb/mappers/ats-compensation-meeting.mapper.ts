import { Types } from 'mongoose';
import { ATSCompensationMeeting } from '../../../../domain/entities/ats-compensation-meeting.entity';
import { IATSCompensationMeetingDocument } from '../models/ats-compensation-meeting.model';

export class ATSCompensationMeetingMapper {
  static toDomain(doc: IATSCompensationMeetingDocument): ATSCompensationMeeting {
    return new ATSCompensationMeeting(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.type,
      doc.scheduledDate,
      doc.location,
      doc.meetingLink,
      doc.notes,
      doc.status || 'scheduled',
      doc.completedAt,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(meeting: ATSCompensationMeeting): Partial<IATSCompensationMeetingDocument> {
    return {
      applicationId: new Types.ObjectId(meeting.applicationId),
      type: meeting.type,
      scheduledDate: meeting.scheduledDate,
      location: meeting.location,
      meetingLink: meeting.meetingLink,
      notes: meeting.notes,
      status: meeting.status,
      completedAt: meeting.completedAt,
    };
  }
}


