import { CompanySubscriptionDto } from 'src/application/dtos/admin/subscription/common/company-subscription.dto';

export interface ActiveSubscriptionResponseDto extends CompanySubscriptionDto {
  activeJobCount?: number;
}

