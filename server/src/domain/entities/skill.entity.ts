export class Skill {
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
  }): Skill {
    const now = new Date();
    return new Skill(
      data.id,
      data.name,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}