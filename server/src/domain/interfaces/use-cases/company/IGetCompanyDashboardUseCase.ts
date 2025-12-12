import { GetCompanyDashboardResponseDto } from 'src/application/dto/company/company-dashboard-response.dto';


export interface IGetCompanyDashboardUseCase {
  execute(userId: string): Promise<GetCompanyDashboardResponseDto>;
}
