import { ATSActivity } from 'src/domain/entities/ats-activity.entity';

export interface GetApplicationActivitiesResponseDto {
    activities: ATSActivity[];
    nextCursor: string | null;
    hasMore: boolean;
}
