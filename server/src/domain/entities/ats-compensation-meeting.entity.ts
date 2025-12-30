export class ATSCompensationMeeting {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly type: 'call' | 'online' | 'in-person',
    public readonly scheduledDate: Date,
    public readonly location?: string,
    public readonly meetingLink?: string,
    public readonly notes?: string,
    public readonly status: 'scheduled' | 'completed' | 'cancelled' = 'scheduled',
    public readonly completedAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(data: {
    id: string;
    applicationId: string;
    type: 'call' | 'online' | 'in-person';
    scheduledDate: Date;
    location?: string;
    meetingLink?: string;
    notes?: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): ATSCompensationMeeting {
    return new ATSCompensationMeeting(
      data.id,
      data.applicationId,
      data.type,
      data.scheduledDate,
      data.location,
      data.meetingLink,
      data.notes,
      data.status ?? 'scheduled',
      data.completedAt,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}


