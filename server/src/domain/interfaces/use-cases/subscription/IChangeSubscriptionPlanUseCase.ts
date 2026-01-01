import { ChangeSubscriptionPlanRequestDto } from 'src/application/dtos/subscription/requests/change-subscription-plan.dto';
import { ChangeSubscriptionResult } from 'src/application/dtos/admin/subscription/responses/change-subscription-result.dto';


export interface IChangeSubscriptionPlanUseCase {
  execute(data: ChangeSubscriptionPlanRequestDto): Promise<ChangeSubscriptionResult>;
}

