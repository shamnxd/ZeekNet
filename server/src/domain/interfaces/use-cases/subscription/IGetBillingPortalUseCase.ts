import { GetBillingPortalRequestDto } from 'src/application/dtos/subscription/requests/get-billing-portal.dto';

export interface IGetBillingPortalUseCase {
  execute(data: GetBillingPortalRequestDto): Promise<{ url: string; }>;
}

