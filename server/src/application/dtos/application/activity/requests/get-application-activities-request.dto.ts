export interface GetApplicationActivitiesRequestDto {
    applicationId: string;
    limit: number;
    cursor?: string;
}
