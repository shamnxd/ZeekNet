import { Types } from 'mongoose';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';
import { ATSCompensationMeetingModel, IATSCompensationMeetingDocument } from 'src/infrastructure/persistence/mongodb/models/ats-compensation-meeting.model';
import { ATSCompensationMeetingMapper } from 'src/infrastructure/mappers/persistence/mongodb/ats/ats-compensation-meeting.mapper';

export class ATSCompensationMeetingRepository implements IATSCompensationMeetingRepository {
  async create(meeting: ATSCompensationMeeting): Promise<ATSCompensationMeeting> {
    const doc = await ATSCompensationMeetingModel.create(ATSCompensationMeetingMapper.toDocument(meeting));
    return ATSCompensationMeetingMapper.toEntity(doc);
  }

  async findById(id: string): Promise<ATSCompensationMeeting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSCompensationMeetingModel.findById(id);
    return doc ? ATSCompensationMeetingMapper.toEntity(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<ATSCompensationMeeting[]> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return [];
    }
    const docs = await ATSCompensationMeetingModel.find({ applicationId: new Types.ObjectId(applicationId) })
      .sort({ scheduledDate: -1 });
    return docs.map(doc => ATSCompensationMeetingMapper.toEntity(doc));
  }

  async update(id: string, updateData: Partial<ATSCompensationMeeting>): Promise<ATSCompensationMeeting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const updateDoc: Partial<IATSCompensationMeetingDocument> = {};
    if (updateData.status !== undefined) updateDoc.status = updateData.status;
    if (updateData.completedAt !== undefined) updateDoc.completedAt = updateData.completedAt;
    if (updateData.type !== undefined) updateDoc.type = updateData.type;
    if (updateData.scheduledDate !== undefined) updateDoc.scheduledDate = updateData.scheduledDate;
    if (updateData.location !== undefined) updateDoc.location = updateData.location;
    if (updateData.meetingLink !== undefined) updateDoc.meetingLink = updateData.meetingLink;
    if (updateData.notes !== undefined) updateDoc.notes = updateData.notes;
    
    const doc = await ATSCompensationMeetingModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: updateDoc },
      { new: true },
    );
    return doc ? ATSCompensationMeetingMapper.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ATSCompensationMeetingModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }
}



