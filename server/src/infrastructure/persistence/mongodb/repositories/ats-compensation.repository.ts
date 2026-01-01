import { Types } from 'mongoose';
import { IATSCompensationRepository } from '../../../../domain/interfaces/repositories/ats/IATSCompensationRepository';
import { ATSCompensation } from '../../../../domain/entities/ats-compensation.entity';
import { ATSCompensationModel } from '../models/ats-compensation.model';
import { ATSCompensationMapper } from '../mappers/ats/ats-compensation.mapper';

export class ATSCompensationRepository implements IATSCompensationRepository {
  async create(compensation: ATSCompensation): Promise<ATSCompensation> {
    const doc = await ATSCompensationModel.create(ATSCompensationMapper.toDocument(compensation));
    return ATSCompensationMapper.toEntity(doc);
  }

  async findByApplicationId(applicationId: string): Promise<ATSCompensation | null> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return null;
    }
    const doc = await ATSCompensationModel.findOne({ applicationId: new Types.ObjectId(applicationId) });
    return doc ? ATSCompensationMapper.toEntity(doc) : null;
  }

  async update(applicationId: string, data: Partial<ATSCompensation>): Promise<ATSCompensation | null> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return null;
    }
    const updateData: {
      candidateExpected?: string;
      companyProposed?: string;
      finalAgreed?: string;
      expectedJoining?: Date;
      benefits?: string[];
      approvedAt?: Date;
      approvedBy?: Types.ObjectId;
      approvedByName?: string;
    } = {};
    if (data.candidateExpected !== undefined) updateData.candidateExpected = data.candidateExpected;
    if (data.companyProposed !== undefined) updateData.companyProposed = data.companyProposed;
    if (data.finalAgreed !== undefined) updateData.finalAgreed = data.finalAgreed;
    if (data.expectedJoining !== undefined) updateData.expectedJoining = data.expectedJoining;
    if (data.benefits !== undefined) updateData.benefits = data.benefits;
    if (data.approvedAt !== undefined) updateData.approvedAt = data.approvedAt;
    if (data.approvedBy !== undefined) updateData.approvedBy = data.approvedBy ? new Types.ObjectId(data.approvedBy) : undefined;
    if (data.approvedByName !== undefined) updateData.approvedByName = data.approvedByName;

    const doc = await ATSCompensationModel.findOneAndUpdate(
      { applicationId: new Types.ObjectId(applicationId) },
      { $set: updateData },
      { new: true },
    );
    return doc ? ATSCompensationMapper.toEntity(doc) : null;
  }

  async delete(applicationId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return false;
    }
    const result = await ATSCompensationModel.deleteOne({ applicationId: new Types.ObjectId(applicationId) });
    return result.deletedCount > 0;
  }
}


