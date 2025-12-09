import { ChangeSubscriptionPlanRequestDto } from 'src/application/dto/company/change-subscription-plan.dto';
import { ChangeSubscriptionResult } from '../subscriptions/ChangeSubscriptionResult';


export interface IChangeSubscriptionPlanUseCase {
  execute(data: ChangeSubscriptionPlanRequestDto): Promise<ChangeSubscriptionResult>;
}
