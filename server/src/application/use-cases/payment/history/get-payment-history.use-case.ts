import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetPaymentHistoryUseCase } from 'src/domain/interfaces/use-cases/payment/history/IGetPaymentHistoryUseCase';
import { PaymentResponseDto } from 'src/application/dtos/payment/responses/payment-response.dto';
import { PaymentMapper } from 'src/application/mappers/payment/payment.mapper';

export class GetPaymentHistoryUseCase implements IGetPaymentHistoryUseCase {
  constructor(
    private _paymentOrderRepository: IPaymentOrderRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string): Promise<PaymentResponseDto[]> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const companyId = companyProfile.id;

    const paymentOrders = await this._paymentOrderRepository.findByCompanyId(companyId);
    
    return PaymentMapper.toResponseList(paymentOrders);
  }
}
