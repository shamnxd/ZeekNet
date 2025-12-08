import { IPaymentOrderRepository } from '../../../domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { IGetAllPaymentOrdersUseCase } from 'src/domain/interfaces/use-cases/admin/IAdminUseCases';

interface PaymentOrderWithDetails {
  id: string;
  orderNo: string;
  companyId: string;
  companyName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: 'dummy' | 'stripe' | 'card';
  invoiceId?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GetAllPaymentOrdersQuery {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  search?: string;
  sortOrder?: 'asc' | 'desc';
}

export class GetAllPaymentOrdersUseCase implements IGetAllPaymentOrdersUseCase {
  constructor(
    private _paymentOrderRepository: IPaymentOrderRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(query: GetAllPaymentOrdersQuery): Promise<{
    orders: PaymentOrderWithDetails[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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

      return {
        id: order.id,
        orderNo: order.invoiceId || `#${order.id.slice(-9).toUpperCase()}`,
        companyId: order.companyId,
        companyName: company?.companyName || 'Unknown Company',
        planId: order.planId,
        planName: plan?.name || 'Unknown Plan',
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        paymentMethod: order.paymentMethod,
        invoiceId: order.invoiceId,
        transactionId: order.transactionId,
        createdAt: order.createdAt || new Date(),
        updatedAt: order.updatedAt || new Date(),
      };
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
