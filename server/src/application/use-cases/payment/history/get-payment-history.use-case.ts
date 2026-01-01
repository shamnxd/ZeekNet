import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { PaymentOrder } from 'src/domain/entities/payment-order.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetPaymentHistoryUseCase } from 'src/domain/interfaces/use-cases/payment/history/IGetPaymentHistoryUseCase';

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
