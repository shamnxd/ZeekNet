export interface CompanySubscriptionDto {
  id: string;
  companyId: string;
  planId: string;
  status: string;
  startDate: Date;
  endDate: Date;
}
