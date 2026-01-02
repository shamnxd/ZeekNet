import { v4 as uuidv4 } from 'uuid';

export class CompanyContact {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly twitterLink?: string,
    public readonly facebookLink?: string,
    public readonly linkedin?: string,
    public readonly email?: string,
    public readonly phone?: string,
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
