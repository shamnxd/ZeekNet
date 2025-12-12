import { IPaymentOrderRepository } from '../../../domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { PaymentOrder } from '../../../domain/entities/payment-order.entity';
import { NotFoundError } from '../../../domain/errors/errors';
import { IGetPaymentHistoryUseCase } from '../../../domain/interfaces/use-cases/payments/IGetPaymentHistoryUseCase';

export class GetPaymentHistoryUseCase implements IGetPaymentHistoryUseCase {
  constructor(
    private _paymentOrderRepository: IPaymentOrderRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string): Promise<PaymentOrder[]> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const companyId = companyProfile.id;

    const paymentOrders = await this._paymentOrderRepository.findByCompanyId(companyId);
    
    return paymentOrders;
  }
}
