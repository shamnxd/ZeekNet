export class JobCategory {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): JobCategory {
    const now = new Date();
    return new JobCategory(
      data.id,
      data.name,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}