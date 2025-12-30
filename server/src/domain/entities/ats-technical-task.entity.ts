export class ATSTechnicalTask {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly deadline: Date,
    public readonly documentUrl?: string,
    public readonly documentFilename?: string,
    public readonly submissionUrl?: string,
    public readonly submissionFilename?: string,
    public readonly submissionLink?: string,
    public readonly submissionNote?: string,
    public readonly submittedAt?: Date,
    public readonly status: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled' = 'assigned',
    public readonly rating?: number,
    public readonly feedback?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(data: {
    id: string;
    applicationId: string;
    title: string;
    description: string;
    deadline: Date;
    documentUrl?: string;
    documentFilename?: string;
    submissionUrl?: string;
    submissionFilename?: string;
    submissionLink?: string;
    submissionNote?: string;
    submittedAt?: Date;
    status?: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled';
    rating?: number;
    feedback?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ATSTechnicalTask {
    return new ATSTechnicalTask(
      data.id,
      data.applicationId,
      data.title,
      data.description,
      data.deadline,
      data.documentUrl,
      data.documentFilename,
      data.submissionUrl,
      data.submissionFilename,
      data.submissionLink,
      data.submissionNote,
      data.submittedAt,
      data.status ?? 'assigned',
      data.rating,
      data.feedback,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
