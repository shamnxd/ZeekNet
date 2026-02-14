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
    period: 'day' | 'week' | 'month' | 'year',
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ label: string; value: number }[]> {
    const now = new Date();
    let start: Date;
    let end: Date = endDate || now;

    // Determine date range based on period
    if (startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      switch (period) {
      case 'day':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        break;
      case 'week':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 27);
        break;
      case 'month':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case 'year':
        start = new Date(now.getFullYear() - 4, 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), 0, 1);
      }
    }

    type GroupFormat =
      | { year: { $year: string }; month: { $month: string }; day: { $dayOfMonth: string } }
      | { year: { $year: string }; week: { $week: string } }
      | { $month: string }
      | { $year: string };

    let groupFormat: GroupFormat;
    let labelFormat: (date: Date) => string;

    switch (period) {
    case 'day':
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
      labelFormat = (date: Date) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[date.getMonth()]} ${date.getDate()}`;
      };
      break;
    case 'week':
      groupFormat = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' },
      };
      labelFormat = (date: Date) => `Week ${Math.ceil(date.getDate() / 7)}`;
      break;
    case 'month':
      groupFormat = { $month: '$createdAt' };
      labelFormat = (date: Date) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[date.getMonth()];
      };
      break;
    case 'year':
      groupFormat = { $year: '$createdAt' };
      labelFormat = (date: Date) => date.getFullYear().toString();
      break;
    default:
      groupFormat = { $month: '$createdAt' };
      labelFormat = (date: Date) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[date.getMonth()];
      };
    }

    const result = await PaymentOrderModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: groupFormat,
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Format results based on period
    if (period === 'month') {
      const monthlyData: { label: string; value: number }[] = [];
      for (let i = 1; i <= 12; i++) {
        const existing = result.find(item => item._id === i);
        const date = new Date(now.getFullYear(), i - 1, 1);
        monthlyData.push({
          label: labelFormat(date),
          value: existing ? existing.amount : 0,
        });
      }
      return monthlyData;
    } else if (period === 'year') {
      const yearlyData: { label: string; value: number }[] = [];
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      for (let year = startYear; year <= endYear; year++) {
        const existing = result.find(item => item._id === year);
        yearlyData.push({
          label: year.toString(),
          value: existing ? existing.amount : 0,
        });
      }
      return yearlyData;
    } else if (period === 'day') {
      const dailyData: { label: string; value: number }[] = [];
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const existing = result.find(item =>
          item._id.year === currentDate.getFullYear() &&
          item._id.month === currentDate.getMonth() + 1 &&
          item._id.day === currentDate.getDate(),
        );
        dailyData.push({
          label: labelFormat(new Date(currentDate)),
          value: existing ? existing.amount : 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dailyData;
    } else {
      // week
      return result.map(item => ({
        label: `Week ${item._id.week}`,
        value: item.amount,
      }));
    }
  }

  async findRecent(limit: number): Promise<PaymentOrder[]> {
    const docs = await PaymentOrderModel.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return docs.map(doc => PaymentOrderMapper.toEntity(doc));
  }
}

