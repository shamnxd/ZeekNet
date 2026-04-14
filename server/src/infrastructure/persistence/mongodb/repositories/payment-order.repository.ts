import { injectable } from 'inversify';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { PaymentOrder } from 'src/domain/entities/payment-order.entity';
import { PaymentOrderModel, PaymentOrderDocument } from 'src/infrastructure/persistence/mongodb/models/payment-order.model';
import { PaymentOrderMapper } from 'src/infrastructure/mappers/persistence/mongodb/payment/payment-order.mapper';
import { Types } from 'mongoose';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

@injectable()
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

  async sumTotalEarnings(year?: number): Promise<number> {
    interface MatchStage {
      status: string;
      createdAt?: { $gte: Date; $lt: Date };
    }

    const matchStage: MatchStage = { status: 'completed' };

    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    const result = await PaymentOrderModel.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async sumEarningsByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await PaymentOrderModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getMonthlyEarnings(year: number): Promise<{ month: number; amount: number }[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const result = await PaymentOrderModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          amount: { $sum: '$amount' },
        },
      },
    ]);

    const earnings = result.map(item => ({
      month: item._id,
      amount: item.amount,
    }));

    // Fill missing months with 0
    const monthlyData: { month: number; amount: number }[] = [];
    for (let i = 1; i <= 12; i++) {
      const existing = earnings.find(e => e.month === i);
      monthlyData.push({ month: i, amount: existing ? existing.amount : 0 });
    }

    return monthlyData;
  }

  async getEarningsByPeriod(
    period: 'all' | 'day' | 'week' | 'month' | 'year',
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ label: string; value: number }[]> {
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // day => hourly for current day/custom day
    if (period === 'day') {
      const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const result = await PaymentOrderModel.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: { hour: { $hour: '$createdAt' } },
            amount: { $sum: '$amount' },
          },
        },
      ]);

      const hourlyData: { label: string; value: number }[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const existing = result.find(item => item._id.hour === hour);
        hourlyData.push({ label: `${hour.toString().padStart(2, '0')}:00`, value: existing ? existing.amount : 0 });
      }
      return hourlyData;
    }

    // week => daily (last 7 days or custom)
    if (period === 'week') {
      const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
      const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const result = await PaymentOrderModel.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            amount: { $sum: '$amount' },
          },
        },
      ]);

      const data: { label: string; value: number }[] = [];
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const existing = result.find(item =>
          item._id.year === currentDate.getFullYear() &&
          item._id.month === currentDate.getMonth() + 1 &&
          item._id.day === currentDate.getDate(),
        );
        data.push({
          label: `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`,
          value: existing ? existing.amount : 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return data;
    }

    // month => daily for month
    if (period === 'month') {
      const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      const result = await PaymentOrderModel.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            amount: { $sum: '$amount' },
          },
        },
      ]);

      const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      const data: { label: string; value: number }[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const existing = result.find(item =>
          item._id.year === start.getFullYear() &&
          item._id.month === start.getMonth() + 1 &&
          item._id.day === day,
        );
        data.push({ label: day.toString(), value: existing ? existing.amount : 0 });
      }
      return data;
    }

    // all => year-wise for all time
    if (period === 'all') {
      const result = await PaymentOrderModel.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' } },
            amount: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1 } },
      ]);

      if (result.length === 0) return [];

      const startYear = result[0]._id.year as number;
      const endYear = result[result.length - 1]._id.year as number;
      const data: { label: string; value: number }[] = [];
      for (let year = startYear; year <= endYear; year++) {
        const existing = result.find(item => item._id.year === year);
        data.push({ label: year.toString(), value: existing ? existing.amount : 0 });
      }
      return data;
    }

    // year => monthly for selected/current year
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const result = await PaymentOrderModel.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          amount: { $sum: '$amount' },
        },
      },
    ]);

    const data: { label: string; value: number }[] = [];
    for (let month = 1; month <= 12; month++) {
      const existing = result.find(item => item._id.month === month);
      data.push({ label: monthNames[month - 1], value: existing ? existing.amount : 0 });
    }
    return data;
  }

  async findRecent(limit: number): Promise<PaymentOrder[]> {
    const docs = await PaymentOrderModel.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return docs.map(doc => PaymentOrderMapper.toEntity(doc));
  }
}


