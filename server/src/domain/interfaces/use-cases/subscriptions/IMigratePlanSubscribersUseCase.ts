import { MigratePlanSubscribersRequestDto } from 'src/application/dto/admin/subscription-plan-management.dto';
import { MigratePlanSubscribersResult } from './MigratePlanSubscribersResult';


export interface IMigratePlanSubscribersUseCase {
  execute(data: MigratePlanSubscribersRequestDto): Promise<MigratePlanSubscribersResult>;
}
