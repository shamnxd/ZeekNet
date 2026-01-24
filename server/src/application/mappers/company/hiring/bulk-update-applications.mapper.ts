import { BulkUpdateApplicationsResponseDto } from 'src/application/dtos/company/hiring/responses/bulk-update-applications-response.dto';

export class BulkUpdateApplicationsMapper {
    static toResponse(
        success: boolean,
        updated: number,
        failed: number,
        errors: Array<{ application_id: string; error: string }>,
    ): BulkUpdateApplicationsResponseDto {
        return {
            success,
            updated,
            failed,
            errors,
        };
    }
}
