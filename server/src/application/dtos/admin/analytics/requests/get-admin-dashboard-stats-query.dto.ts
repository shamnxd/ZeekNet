import { z } from 'zod';
export const GetAdminDashboardStatsQueryDto = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
  startDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'startDate must be before or equal to endDate',
  },
);
export type GetAdminDashboardStatsQueryDto = z.infer<typeof GetAdminDashboardStatsQueryDto>;