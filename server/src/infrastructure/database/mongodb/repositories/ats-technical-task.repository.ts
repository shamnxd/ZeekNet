import { Types } from 'mongoose';
import { IATSTechnicalTaskRepository } from '../../../../domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { ATSTechnicalTask } from '../../../../domain/entities/ats-technical-task.entity';
import { ATSTechnicalTaskModel } from '../models/ats-technical-task.model';
import { ATSTechnicalTaskMapper } from '../mappers/ats-technical-task.mapper';

export class ATSTechnicalTaskRepository implements IATSTechnicalTaskRepository {
  async create(task: ATSTechnicalTask): Promise<ATSTechnicalTask> {
    const doc = await ATSTechnicalTaskModel.create(ATSTechnicalTaskMapper.toDocument(task));
    return ATSTechnicalTaskMapper.toDomain(doc);
  }

  async findById(id: string): Promise<ATSTechnicalTask | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSTechnicalTaskModel.findById(id);
    return doc ? ATSTechnicalTaskMapper.toDomain(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<ATSTechnicalTask[]> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return [];
    }
    const docs = await ATSTechnicalTaskModel.find({ applicationId: new Types.ObjectId(applicationId) })
      .sort({ createdAt: -1 });
    return docs.map(doc => ATSTechnicalTaskMapper.toDomain(doc));
  }

  async update(id: string, data: Partial<ATSTechnicalTask>): Promise<ATSTechnicalTask | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSTechnicalTaskModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return doc ? ATSTechnicalTaskMapper.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ATSTechnicalTaskModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }
}
