export class ATSInterview {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly title: string,
    public readonly scheduledDate: Date,
    public readonly type: 'online' | 'offline',
    public readonly meetingLink?: string,
    public readonly location?: string,
    public readonly status: 'scheduled' | 'completed' | 'cancelled' = 'scheduled',
    public readonly rating?: number,
    public readonly feedback?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(data: {
    id: string;
    applicationId: string;
    title: string;
    scheduledDate: Date;
    type: 'online' | 'offline';
    meetingLink?: string;
    location?: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    rating?: number;
    feedback?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ATSInterview {
    return new ATSInterview(
      data.id,
      data.applicationId,
      data.title,
      data.scheduledDate,
      data.type,
      data.meetingLink,
      data.location,
      data.status ?? 'scheduled',
      data.rating,
      data.feedback,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
