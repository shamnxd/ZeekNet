import { GetApplicationActivitiesRequestDto } from 'src/application/dtos/application/activity/requests/get-application-activities-request.dto';
import { GetApplicationActivitiesResponseDto } from 'src/application/dtos/application/activity/responses/get-application-activities-response.dto';

export interface IGetApplicationActivitiesUseCase {
  execute(params: GetApplicationActivitiesRequestDto): Promise<GetApplicationActivitiesResponseDto>;
}



