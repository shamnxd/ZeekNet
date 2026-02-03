import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';
import { GetCommentsByApplicationParamsDto } from 'src/application/dtos/application/comments/requests/get-comments-by-application-params.dto';

export interface IGetCompensationNotesUseCase {
    execute(params: GetCommentsByApplicationParamsDto): Promise<ATSCommentResponseDto[]>;
}
