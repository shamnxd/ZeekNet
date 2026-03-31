import { Types } from 'mongoose';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { ATSCommentModel } from 'src/infrastructure/persistence/mongodb/models/ats-comment.model';
import { ATSCommentMapper } from 'src/infrastructure/mappers/persistence/mongodb/ats/ats-comment.mapper';

export class ATSCommentRepository implements IATSCommentRepository {
  async create(comment: ATSComment): Promise<ATSComment> {
    const doc = await ATSCommentModel.create(ATSCommentMapper.toDocument(comment));
    return ATSCommentMapper.toEntity(doc);
  }

  async findById(id: string): Promise<ATSComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSCommentModel.findById(id);
    return doc ? ATSCommentMapper.toEntity(doc) : null;
  }

  async findByApplicationId(applicationId: string, stage?: string): Promise<ATSComment[]> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return [];
    }

    const query: Record<string, unknown> = { applicationId: new Types.ObjectId(applicationId) };
    if (stage) {
      query.stage = stage;
    }

    const docs = await ATSCommentModel.find(query)
      .sort({ createdAt: -1 });

    return docs.map(doc => ATSCommentMapper.toEntity(doc));
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ATSCommentModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }
}

