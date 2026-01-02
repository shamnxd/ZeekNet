import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { PaymentOrder } from 'src/domain/entities/payment-order.entity';
import { PaymentOrderModel, PaymentOrderDocument } from 'src/infrastructure/persistence/mongodb/models/payment-order.model';
import { PaymentOrderMapper } from 'src/infrastructure/mappers/persistence/mongodb/payment/payment-order.mapper';
import { Types } from 'mongoose';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class PaymentOrderRepository extends RepositoryBase<PaymentOrder, PaymentOrderDocument> implements IPaymentOrderRepository {
  constructor() {
    super(PaymentOrderModel);
  }

  protected mapToEntity(document: PaymentOrderDocument): PaymentOrder {
    return PaymentOrderMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<PaymentOrder>): Partial<PaymentOrderDocument> {
    return PaymentOrderMapper.toDocument(entity);
  }

  async findByCompanyId(companyId: string): Promise<PaymentOrder[]> {
    if (!Types.ObjectId.isValid(companyId)) {
      return [];
    }

    const docs = await PaymentOrderModel.find({ companyId: new Types.ObjectId(companyId) })
      .sort({ createdAt: -1 });
    
    return docs.map(doc => PaymentOrderMapper.toEntity(doc));
  }

  async findByStripeInvoiceId(stripeInvoiceId: string): Promise<PaymentOrder | null> {
    const doc = await PaymentOrderModel.findOne({ stripeInvoiceId });
    return doc ? PaymentOrderMapper.toEntity(doc) : null;
  }

  async updateStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid payment order ID');
    }

    await PaymentOrderModel.findByIdAndUpdate(id, { status, updatedAt: new Date() });
  }

  async findAll(options?: { status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'; sortOrder?: 'asc' | 'desc' }): Promise<PaymentOrder[]> {
    const filter: Record<string, unknown> = {};
    
    if (options?.status) {
      filter.status = options.status;
    }

    const sortOrder = options?.sortOrder === 'asc' ? 1 : -1;

    const docs = await PaymentOrderModel.find(filter)
      .sort({ createdAt: sortOrder });
    
    return docs.map(doc => PaymentOrderMapper.toEntity(doc));
  }
}

