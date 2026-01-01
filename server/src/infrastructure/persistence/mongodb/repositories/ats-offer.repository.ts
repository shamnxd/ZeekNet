import { Types } from 'mongoose';
import { IATSOfferRepository } from '../../../../domain/interfaces/repositories/ats/IATSOfferRepository';
import { ATSOffer } from '../../../../domain/entities/ats-offer.entity';
import { ATSOfferModel } from '../models/ats-offer.model';
import { ATSOfferMapper } from '../mappers/ats/ats-offer.mapper';

export class ATSOfferRepository implements IATSOfferRepository {
  async create(offer: ATSOffer): Promise<ATSOffer> {
    const doc = await ATSOfferModel.create(ATSOfferMapper.toDocument(offer));
    return ATSOfferMapper.toEntity(doc);
  }

  async findById(id: string): Promise<ATSOffer | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSOfferModel.findById(id);
    return doc ? ATSOfferMapper.toEntity(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<ATSOffer[]> {
    if (!Types.ObjectId.isValid(applicationId)) {
      return [];
    }
    const docs = await ATSOfferModel.find({ applicationId: new Types.ObjectId(applicationId) })
      .sort({ createdAt: -1 });
    return docs.map(doc => ATSOfferMapper.toEntity(doc));
  }

  async update(id: string, data: Partial<ATSOffer>): Promise<ATSOffer | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await ATSOfferModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return doc ? ATSOfferMapper.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ATSOfferModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }
}

