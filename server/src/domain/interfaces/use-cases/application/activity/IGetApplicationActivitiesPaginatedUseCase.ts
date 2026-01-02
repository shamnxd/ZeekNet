import { PaginationCursor, PaginatedActivitiesResult } from 'src/domain/interfaces/repositories/ats/IATSActivityRepository';

export interface GetApplicationActivitiesPaginatedParams {
  applicationId: string;
  limit: number;
  cursor?: PaginationCursor;
}

export interface IGetApplicationActivitiesPaginatedUseCase {
  execute(params: GetApplicationActivitiesPaginatedParams): Promise<PaginatedActivitiesResult>;
}



