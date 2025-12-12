import { MigratePlanSubscribersRequestDto } from 'src/application/dto/admin/subscription-plan-management.dto';
import { MigratePlanSubscribersResult } from 'src/application/dto/subscriptions/migrate-plan-subscribers-result.dto';


export interface IMigratePlanSubscribersUseCase {
  execute(data: MigratePlanSubscribersRequestDto): Promise<MigratePlanSubscribersResult>;
}
