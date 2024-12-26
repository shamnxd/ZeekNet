import { Types } from 'mongoose';
import { IATSCommentRepository } from '../../../../domain/interfaces/repositories/ats/IATSCommentRepository';
import { ATSComment } from '../../../../domain/entities/ats-comment.entity';
import { ATSCommentModel } from '../models/ats-comment.model';
import { ATSCommentMapper } from '../mappers/ats-comment.mapper';

export class ATSCommentRepository implements IATSCommentRepository {
  async create(comment: ATSComment): Promise<ATSComment> {
    const doc = await ATSCommentModel.create(ATSCommentMapper.toDocument(comment));
    return ATSCommentMapper.toDomain(doc);
  }

  async findById(id: string): Promise<ATSComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSCommentModel.findById(id);
    return doc ? ATSCommentMapper.toDomain(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<ATSComment[]> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return [];
    }
    const docs = await ATSCommentModel.find({ applicationId: new Types.ObjectId(applicationId) })
      .sort({ createdAt: -1 });
    return docs.map(doc => ATSCommentMapper.toDomain(doc));
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ATSCommentModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }
}
