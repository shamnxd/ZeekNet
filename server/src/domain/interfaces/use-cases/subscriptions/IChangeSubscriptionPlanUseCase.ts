import { ChangeSubscriptionPlanRequestDto } from 'src/application/dtos/company/common/change-subscription-plan.dto';
import { ChangeSubscriptionResult } from 'src/application/dtos/subscriptions/common/change-subscription-result.dto';


export interface IChangeSubscriptionPlanUseCase {
  execute(data: ChangeSubscriptionPlanRequestDto): Promise<ChangeSubscriptionResult>;
}

