export interface BulkUpdateApplicationsResponseDto {
    success: boolean;
    updated: number;
    failed: number;
    errors: Array<{
        application_id: string;
        error: string;
    }>;
}
