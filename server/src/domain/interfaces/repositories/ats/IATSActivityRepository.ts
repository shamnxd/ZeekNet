import { ATSActivity } from 'src/domain/entities/ats-activity.entity';

export interface PaginationCursor {
  createdAt: Date;
  _id: string;
}

export interface PaginatedActivitiesResult {
  activities: ATSActivity[];
  nextCursor: PaginationCursor | null;
  hasMore: boolean;
}

export interface IATSActivityRepository {
  create(activity: ATSActivity): Promise<ATSActivity>;
  findById(id: string): Promise<ATSActivity | null>;
  findByApplicationId(applicationId: string): Promise<ATSActivity[]>;
  findByApplicationIdPaginated(
    applicationId: string,
    limit: number,
    cursor?: PaginationCursor,
  ): Promise<PaginatedActivitiesResult>;
  findAll(): Promise<ATSActivity[]>;
  delete(id: string): Promise<boolean>;
}
