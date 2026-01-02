import { ATSOffer } from 'src/domain/entities/ats-offer.entity';

export interface IATSOfferRepository {
  create(offer: ATSOffer): Promise<ATSOffer>;
  findById(id: string): Promise<ATSOffer | null>;
  findByApplicationId(applicationId: string): Promise<ATSOffer[]>;
  update(id: string, data: Partial<ATSOffer>): Promise<ATSOffer | null>;
  delete(id: string): Promise<boolean>;
}
