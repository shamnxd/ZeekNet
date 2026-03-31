import { PreviewPlanChangeRequestDto } from 'src/application/dtos/subscription/requests/preview-plan-change.dto';
import { PreviewPlanChangeResponseDto } from 'src/application/dtos/subscription/responses/preview-plan-change-response.dto';

export interface IPreviewPlanChangeUseCase {
    execute(data: PreviewPlanChangeRequestDto): Promise<PreviewPlanChangeResponseDto>;
}
