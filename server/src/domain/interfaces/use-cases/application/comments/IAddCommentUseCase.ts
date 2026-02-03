import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';
import { AddCommentParamsDto } from 'src/application/dtos/application/comments/requests/add-comment-params.dto';

export interface IAddCommentUseCase {
  execute(params: AddCommentParamsDto): Promise<ATSCommentResponseDto>;
}
