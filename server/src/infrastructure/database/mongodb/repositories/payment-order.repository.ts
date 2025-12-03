import { IPaymentOrderRepository } from '../../../../domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { PaymentOrder } from '../../../../domain/entities/payment-order.entity';
import { PaymentOrderModel, PaymentOrderDocument } from '../models/payment-order.model';
import { PaymentOrderMapper } from '../mappers/payment-order.mapper';
import { Types } from 'mongoose';

export class PaymentOrderRepository implements IPaymentOrderRepository {
  async create(order: PaymentOrder): Promise<PaymentOrder> {
    const doc = PaymentOrderMapper.toDocument(order);
    doc.companyId = new Types.ObjectId(order.companyId) as unknown as PaymentOrderDocument['companyId'];
    doc.planId = new Types.ObjectId(order.planId) as unknown as PaymentOrderDocument['planId'];
    
    const created = await PaymentOrderModel.create(doc);
    return PaymentOrderMapper.toEntity(created);
  }

  async findById(id: string): Promise<PaymentOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await PaymentOrderModel.findById(id);
    return doc ? PaymentOrderMapper.toEntity(doc) : null;
  }

  async findByCompanyId(companyId: string): Promise<PaymentOrder[]> {
    if (!Types.ObjectId.isValid(companyId)) {
      return [];
    }

    const docs = await PaymentOrderModel.find({ companyId: new Types.ObjectId(companyId) })
      .sort({ createdAt: -1 });
    
    return docs.map(doc => PaymentOrderMapper.toEntity(doc));
  }

  async findByTransactionId(transactionId: string): Promise<PaymentOrder | null> {
    const doc = await PaymentOrderModel.findOne({ transactionId });
    return doc ? PaymentOrderMapper.toEntity(doc) : null;
  }

  async updateStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled'): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid payment order ID');
    }

    await PaymentOrderModel.findByIdAndUpdate(id, { status, updatedAt: new Date() });
  }

  async findAll(options?: { status?: 'pending' | 'completed' | 'failed' | 'cancelled'; sortOrder?: 'asc' | 'desc' }): Promise<PaymentOrder[]> {
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
