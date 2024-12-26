export class ATSCompensation {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly candidateExpected: string,
    public readonly companyProposed?: string,
    public readonly finalAgreed?: string,
    public readonly expectedJoining?: Date,
    public readonly benefits: string[] = [],
    public readonly approvedAt?: Date,
    public readonly approvedBy?: string,
    public readonly approvedByName?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(data: {
    id: string;
    applicationId: string;
    candidateExpected: string;
    companyProposed?: string;
    finalAgreed?: string;
    expectedJoining?: Date;
    benefits?: string[];
    approvedAt?: Date;
    approvedBy?: string;
    approvedByName?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ATSCompensation {
    return new ATSCompensation(
      data.id,
      data.applicationId,
      data.candidateExpected,
      data.companyProposed,
      data.finalAgreed,
      data.expectedJoining,
      data.benefits ?? [],
      data.approvedAt,
      data.approvedBy,
      data.approvedByName,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}

