import { IGetCompensationNotesUseCase } from 'src/domain/interfaces/use-cases/application/comments/IGetCompensationNotesUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { GetCommentsByApplicationParamsDto } from 'src/application/dtos/application/comments/requests/get-comments-by-application-params.dto';
import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';
import { ATSCommentMapper } from 'src/application/mappers/ats/ats-comment.mapper';

export class GetCompensationNotesUseCase implements IGetCompensationNotesUseCase {
  constructor(private commentRepository: IATSCommentRepository) { }

  async execute(params: GetCommentsByApplicationParamsDto): Promise<ATSCommentResponseDto[]> {
    const allComments = await this.commentRepository.findByApplicationId(params.applicationId);
    const compensationComments = allComments.filter(comment => comment.stage === ATSStage.COMPENSATION);
    return ATSCommentMapper.toResponseList(compensationComments);
  }
}
