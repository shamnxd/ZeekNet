import { v4 as uuidv4 } from 'uuid';

export class CompanyOfficeLocation {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly location: string,
    public readonly isHeadquarters: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly officeName?: string,
    public readonly address?: string,
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
