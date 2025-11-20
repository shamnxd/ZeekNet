import { v4 as uuidv4 } from 'uuid';

export class CompanyBenefits {
  private constructor(
    public readonly id: string,
    public readonly companyId: string,
    public perk: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public description?: string,
  ) {}

  static create(data: { id?: string; companyId: string; perk: string; description?: string; createdAt?: Date; updatedAt?: Date }): CompanyBenefits {
    const now = new Date();
    return new CompanyBenefits(data.id || uuidv4(), data.companyId, data.perk, data.createdAt ?? now, data.updatedAt ?? now, data.description);
  }

}