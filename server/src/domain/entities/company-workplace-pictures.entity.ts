import { v4 as uuidv4 } from 'uuid';

export class CompanyWorkplacePictures {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly pictureUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly caption?: string,
  ) {}

  static create(data: {
    id?: string;
    companyId: string;
    pictureUrl: string;
    caption?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): CompanyWorkplacePictures {
    const now = new Date();
    return new CompanyWorkplacePictures(
      data.id || uuidv4(),
      data.companyId,
      data.pictureUrl,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.caption,
    );
  }

}