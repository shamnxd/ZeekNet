import { Types, Document } from 'mongoose';
import { IATSActivityRepository, PaginationCursor, PaginatedActivitiesResult } from 'src/domain/interfaces/repositories/ats/IATSActivityRepository';
import { ATSActivity } from 'src/domain/entities/ats-activity.entity';
import { ATSActivityModel, IATSActivityDocument } from 'src/infrastructure/persistence/mongodb/models/ats-activity.model';
import { ATSActivityMapper } from 'src/infrastructure/mappers/persistence/mongodb/ats/ats-activity.mapper';

export class ATSActivityRepository implements IATSActivityRepository {
  async create(activity: ATSActivity): Promise<ATSActivity> {
    const doc = await ATSActivityModel.create(ATSActivityMapper.toDocument(activity));
    return ATSActivityMapper.toEntity(doc);
  }

  async findById(id: string): Promise<ATSActivity | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSActivityModel.findById(id);
    return doc ? ATSActivityMapper.toEntity(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<ATSActivity[]> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return [];
    }
    const docs = await ATSActivityModel.find({ applicationId: new Types.ObjectId(applicationId) })
      .sort({ createdAt: -1 });
    return docs.map(doc => ATSActivityMapper.toEntity(doc));
  }

  async findByApplicationIdPaginated(
    applicationId: string,
    limit: number,
    cursor?: PaginationCursor,
  ): Promise<PaginatedActivitiesResult> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return {
        activities: [],
        nextCursor: null,
        hasMore: false,
      };
    }

    const query: Record<string, unknown> = {
      applicationId: new Types.ObjectId(applicationId),
    };

    
    
    
    if (cursor) {
      const cursorCreatedAt = new Date(cursor.createdAt);
      const cursorId = new Types.ObjectId(cursor._id);
      
      query.$or = [
        { createdAt: { $lt: cursorCreatedAt } },
        {
          createdAt: cursorCreatedAt,
          _id: { $lt: cursorId },
        },
      ];
    }

    
    
    const docs = await ATSActivityModel.find(query)
      .sort({ createdAt: -1, _id: -1 }) 
      .limit(limit + 1)
      .lean();

    const hasMore = docs.length > limit;
    const activitiesToReturn = hasMore ? docs.slice(0, limit) : docs;

    const activities = activitiesToReturn.map(doc => ATSActivityMapper.toEntity(doc as unknown as IATSActivityDocument & Document));

    let nextCursor: PaginationCursor | null = null;
    if (hasMore && activities.length > 0) {
      
      const lastActivity = activities[activities.length - 1];
      nextCursor = {
        createdAt: lastActivity.createdAt,
        _id: lastActivity.id,
      };
    }

    return {
      activities,
      nextCursor,
      hasMore,
    };
  }

  async findAll(): Promise<ATSActivity[]> {
    const docs = await ATSActivityModel.find().sort({ createdAt: -1 });
    return docs.map(doc => ATSActivityMapper.toEntity(doc));
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ATSActivityModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }
}

