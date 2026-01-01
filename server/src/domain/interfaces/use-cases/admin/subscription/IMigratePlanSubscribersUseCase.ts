import { MigratePlanSubscribersRequestDto } from 'src/application/dtos/admin/subscription/requests/migrate-plan-subscribers-request.dto';
import { MigratePlanSubscribersResult } from 'src/application/dtos/admin/subscription/responses/migrate-plan-subscribers-result.dto';


export interface IMigratePlanSubscribersUseCase {
  execute(data: MigratePlanSubscribersRequestDto): Promise<MigratePlanSubscribersResult>;
}

