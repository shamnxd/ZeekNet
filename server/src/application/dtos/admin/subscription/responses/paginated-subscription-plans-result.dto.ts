import { SubscriptionPlanDto } from 'src/application/dtos/admin/subscription/common/subscription-plan.dto';

export interface PaginatedSubscriptionPlansResultDto {
  plans: SubscriptionPlanDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
