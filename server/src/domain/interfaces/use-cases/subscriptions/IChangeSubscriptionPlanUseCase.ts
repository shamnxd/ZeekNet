import { ChangeSubscriptionPlanRequestDto } from 'src/application/dto/company/change-subscription-plan.dto';
import { ChangeSubscriptionResult } from 'src/application/dto/subscriptions/change-subscription-result.dto';


export interface IChangeSubscriptionPlanUseCase {
  execute(data: ChangeSubscriptionPlanRequestDto): Promise<ChangeSubscriptionResult>;
}
