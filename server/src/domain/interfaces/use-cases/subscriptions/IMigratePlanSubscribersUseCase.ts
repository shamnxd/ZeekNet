import { MigratePlanSubscribersRequestDto } from 'src/application/dtos/admin/common/subscription-plan-management.dto';
import { MigratePlanSubscribersResult } from 'src/application/dtos/subscriptions/common/migrate-plan-subscribers-result.dto';


export interface IMigratePlanSubscribersUseCase {
  execute(data: MigratePlanSubscribersRequestDto): Promise<MigratePlanSubscribersResult>;
}

