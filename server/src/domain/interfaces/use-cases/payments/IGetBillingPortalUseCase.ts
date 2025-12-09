import { GetBillingPortalRequestDto } from 'src/application/dto/company/get-billing-portal.dto';

// be

export interface IGetBillingPortalUseCase {
  execute(data: GetBillingPortalRequestDto): Promise<{ url: string; }>;
}
