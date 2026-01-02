import { IGetApplicationActivitiesPaginatedUseCase, GetApplicationActivitiesPaginatedParams } from 'src/domain/interfaces/use-cases/application/activity/IGetApplicationActivitiesPaginatedUseCase';
import { IATSActivityRepository, PaginatedActivitiesResult } from 'src/domain/interfaces/repositories/ats/IATSActivityRepository';

export class GetApplicationActivitiesPaginatedUseCase implements IGetApplicationActivitiesPaginatedUseCase {
  constructor(private activityRepository: IATSActivityRepository) {}

  async execute(params: GetApplicationActivitiesPaginatedParams): Promise<PaginatedActivitiesResult> {
    return await this.activityRepository.findByApplicationIdPaginated(
      params.applicationId,
      params.limit,
      params.cursor,
    );
  }
}



