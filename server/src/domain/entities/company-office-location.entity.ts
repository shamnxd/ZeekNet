import { v4 as uuidv4 } from 'uuid';

export class CompanyOfficeLocation {
  private constructor(
    public readonly id: string,
    public readonly companyId: string,
    public location: string,
    public isHeadquarters: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public officeName?: string,
    public address?: string,
  ) {}

  static create(data: {
    id?: string;
    companyId: string;
    location: string;
    officeName?: string;
    address?: string;
    isHeadquarters?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): CompanyOfficeLocation {
    const now = new Date();
    return new CompanyOfficeLocation(
      data.id || uuidv4(),
      data.companyId,
      data.location,
      data.isHeadquarters ?? false,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.officeName,
      data.address,
    );
  }

}