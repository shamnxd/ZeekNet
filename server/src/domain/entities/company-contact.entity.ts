import { v4 as uuidv4 } from 'uuid';

export class CompanyContact {
  private constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public twitterLink?: string,
    public facebookLink?: string,
    public linkedin?: string,
    public email?: string,
    public phone?: string,
  ) {}

  static create(data: {
    id?: string;
    companyId: string;
    twitterLink?: string;
    facebookLink?: string;
    linkedin?: string;
    email?: string;
    phone?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): CompanyContact {
    const now = new Date();
    return new CompanyContact(
      data.id || uuidv4(),
      data.companyId,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.twitterLink,
      data.facebookLink,
      data.linkedin,
      data.email,
      data.phone,
    );
  }

}