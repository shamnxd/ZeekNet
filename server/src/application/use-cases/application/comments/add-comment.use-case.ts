import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { v4 as uuidv4 } from 'uuid';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';

import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { AddCommentParamsDto } from 'src/application/dtos/application/comments/requests/add-comment-params.dto';
import { ATSCommentMapper } from 'src/application/mappers/ats/ats-comment.mapper';
import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';

@injectable()
export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(
    @inject(TYPES.ATSCommentRepository) private commentRepository: IATSCommentRepository,
  ) { }

  async execute(params: AddCommentParamsDto): Promise<ATSCommentResponseDto> {
    const comment = ATSComment.create({
      id: uuidv4(),
      applicationId: params.applicationId,
      comment: params.comment,
      stage: params.stage,
      subStage: params.subStage,
    });

    const savedComment = await this.commentRepository.create(comment);

    return ATSCommentMapper.toResponse(savedComment);
  }
}
