import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { AddCommentParamsDto } from 'src/application/dtos/application/comments/requests/add-comment-params.dto';

export interface IAddCommentUseCase {
  execute(params: AddCommentParamsDto): Promise<ATSComment>;
}
