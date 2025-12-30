import { IGetApplicationActivitiesPaginatedUseCase, GetApplicationActivitiesPaginatedParams } from '../../../domain/interfaces/use-cases/ats/IGetApplicationActivitiesPaginatedUseCase';
import { IATSActivityRepository, PaginatedActivitiesResult } from '../../../domain/interfaces/repositories/ats/IATSActivityRepository';

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



