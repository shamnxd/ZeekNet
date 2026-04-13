import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetPaymentHistoryUseCase } from 'src/domain/interfaces/use-cases/payment/history/IGetPaymentHistoryUseCase';
import { PaymentResponseDto } from 'src/application/dtos/payment/responses/payment-response.dto';
import { PaymentMapper } from 'src/application/mappers/payment/payment.mapper';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetPaymentHistoryUseCase implements IGetPaymentHistoryUseCase {
  constructor(
    @inject(TYPES.PaymentOrderRepository) private _paymentOrderRepository: IPaymentOrderRepository,
    @inject(TYPES.CompanyProfileRepository) private _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string): Promise<PaymentResponseDto[]> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
    }

    const companyId = companyProfile.id;

    const paymentOrders = await this._paymentOrderRepository.findByCompanyId(companyId);
    
    return PaymentMapper.toResponseList(paymentOrders);
  }
}
