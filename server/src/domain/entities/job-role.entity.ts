export class JobRole {
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
  }): JobRole {
    const now = new Date();
    return new JobRole(
      data.id,
      data.name,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}

