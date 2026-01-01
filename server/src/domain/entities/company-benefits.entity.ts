import { v4 as uuidv4 } from 'uuid';

export class CompanyBenefits {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly perk: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly description?: string,
  ) {}

  static create(data: { id?: string; companyId: string; perk: string; description?: string; createdAt?: Date; updatedAt?: Date }): CompanyBenefits {
    const now = new Date();
    return new CompanyBenefits(data.id || uuidv4(), data.companyId, data.perk, data.createdAt ?? now, data.updatedAt ?? now, data.description);
  }

}
