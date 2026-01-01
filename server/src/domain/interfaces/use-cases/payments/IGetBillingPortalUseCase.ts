import { GetBillingPortalRequestDto } from 'src/application/dtos/company/requests/get-billing-portal.dto';

export interface IGetBillingPortalUseCase {
  execute(data: GetBillingPortalRequestDto): Promise<{ url: string; }>;
}

