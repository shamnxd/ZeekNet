import { v4 as uuidv4 } from 'uuid';

export class CompanyTechStack {
  private constructor(
    public readonly id: string,
    public readonly companyId: string,
    public techStack: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: { id?: string; companyId: string; techStack: string; createdAt?: Date; updatedAt?: Date }): CompanyTechStack {
    const now = new Date();
    return new CompanyTechStack(data.id || uuidv4(), data.companyId, data.techStack, data.createdAt ?? now, data.updatedAt ?? now);
  }

}