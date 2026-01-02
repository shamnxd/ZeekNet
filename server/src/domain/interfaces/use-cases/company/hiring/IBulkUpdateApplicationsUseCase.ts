import { z } from 'zod';
import { BulkUpdateApplicationsDto } from 'src/application/dtos/company/hiring/requests/bulk-update-applications.dto';

export interface IBulkUpdateApplicationsUseCase {
  execute(
    data: z.infer<typeof BulkUpdateApplicationsDto> & { companyId: string }
  ): Promise<{ success: boolean; updated: number; failed: number; errors: Array<{ application_id: string; error: string }> }>;
}

