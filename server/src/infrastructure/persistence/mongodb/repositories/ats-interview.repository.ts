import { Types } from 'mongoose';
import { IATSInterviewRepository } from '../../../../domain/interfaces/repositories/ats/IATSInterviewRepository';
import { ATSInterview } from '../../../../domain/entities/ats-interview.entity';
import { ATSInterviewModel } from '../models/ats-interview.model';
import { ATSInterviewMapper } from '../mappers/ats/ats-interview.mapper';

export class ATSInterviewRepository implements IATSInterviewRepository {
  async create(interview: ATSInterview): Promise<ATSInterview> {
    const doc = await ATSInterviewModel.create(ATSInterviewMapper.toDocument(interview));
    return ATSInterviewMapper.toEntity(doc);
  }

  async findById(id: string): Promise<ATSInterview | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSInterviewModel.findById(id);
    return doc ? ATSInterviewMapper.toEntity(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<ATSInterview[]> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return [];
    }
    const docs = await ATSInterviewModel.find({ applicationId: new Types.ObjectId(applicationId) })
      .sort({ scheduledDate: -1 });
    return docs.map(doc => ATSInterviewMapper.toEntity(doc));
  }

  async update(id: string, data: Partial<ATSInterview>): Promise<ATSInterview | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSInterviewModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return doc ? ATSInterviewMapper.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ATSInterviewModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }
}

