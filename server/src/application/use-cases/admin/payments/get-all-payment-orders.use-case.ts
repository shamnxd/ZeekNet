import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';
import { IGetAllPaymentOrdersUseCase } from 'src/domain/interfaces/use-cases/admin/payments/IGetAllPaymentOrdersUseCase';
import { GetAllPaymentOrdersRequestDto } from 'src/application/dtos/admin/payments/requests/payment-order.dto';
import { GetAllPaymentOrdersResponseDto } from 'src/application/dtos/admin/payments/responses/get-all-payment-orders-response.dto';

import { PaymentMapper } from 'src/application/mappers/payment/payment.mapper';

export class GetAllPaymentOrdersUseCase implements IGetAllPaymentOrdersUseCase {
  constructor(
    private _paymentOrderRepository: IPaymentOrderRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(query: GetAllPaymentOrdersRequestDto): Promise<GetAllPaymentOrdersResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const allPaymentOrders = await this._paymentOrderRepository.findAll({
      status: query.status,
      sortOrder: query.sortOrder || 'desc',
    });

    const companyIds = [...new Set(allPaymentOrders.map(order => order.companyId))];
    const planIds = [...new Set(allPaymentOrders.map(order => order.planId))];

    const companyProfiles = await this._companyProfileRepository.findByIds(companyIds);
    const subscriptionPlans = await this._subscriptionPlanRepository.findByIds(planIds);

    const companyMap = new Map(companyProfiles.map((cp) => [cp.id, cp]));
    const planMap = new Map(subscriptionPlans.map((sp) => [sp.id, sp]));

    let ordersWithDetails = allPaymentOrders.map((order) => {
      const company = companyMap.get(order.companyId);
      const plan = planMap.get(order.planId) as SubscriptionPlan | undefined;

      return PaymentMapper.toAdminListItemResponse(order, company?.companyName, plan?.name);
    });

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      ordersWithDetails = ordersWithDetails.filter((order) => 
        order.orderNo.toLowerCase().includes(searchLower) ||
        order.companyName.toLowerCase().includes(searchLower) ||
        order.planName.toLowerCase().includes(searchLower) ||
        order.transactionId?.toLowerCase().includes(searchLower),
      );
    }

    const total = ordersWithDetails.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = ordersWithDetails.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      total,
      page,
      limit,
      totalPages,
    };
  }
}


