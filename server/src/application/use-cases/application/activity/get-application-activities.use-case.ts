import { IGetApplicationActivitiesUseCase } from 'src/domain/interfaces/use-cases/application/activity/IGetApplicationActivitiesUseCase';
import { IATSActivityRepository } from 'src/domain/interfaces/repositories/ats/IATSActivityRepository';
import { GetApplicationActivitiesRequestDto } from 'src/application/dtos/application/activity/requests/get-application-activities-request.dto';
import { GetApplicationActivitiesResponseDto } from 'src/application/dtos/application/activity/responses/get-application-activities-response.dto';
import { CursorUtil } from 'src/shared/utils/cursor.util';

export class GetApplicationActivitiesUseCase implements IGetApplicationActivitiesUseCase {
  constructor(private activityRepository: IATSActivityRepository) { }

  async execute(params: GetApplicationActivitiesRequestDto): Promise<GetApplicationActivitiesResponseDto> {
    const parsedCursor = params.cursor ? CursorUtil.parseCursor(params.cursor) : undefined;

    const result = await this.activityRepository.findByApplicationIdPaginated(
      params.applicationId,
      params.limit,
      parsedCursor,
    );

    return {
      activities: result.activities,
      nextCursor: result.nextCursor ? CursorUtil.serializeCursor(result.nextCursor) : null,
      hasMore: result.hasMore,
    };
  }
}



