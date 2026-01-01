import { GetCompanyDashboardResponseDto } from 'src/application/dtos/company/responses/company-dashboard-response.dto';


export interface IGetCompanyDashboardUseCase {
  execute(userId: string): Promise<GetCompanyDashboardResponseDto>;
}

