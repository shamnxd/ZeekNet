import { v4 as uuidv4 } from 'uuid';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';

import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { AddCommentParamsDto } from 'src/application/dtos/application/comments/requests/add-comment-params.dto';
import { NotFoundError } from 'src/domain/errors/errors';
import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';
import { ATSCommentMapper } from 'src/application/mappers/ats/ats-comment.mapper';

export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(
    private commentRepository: IATSCommentRepository,

    private userRepository: IUserRepository,
  ) { }

  async execute(params: AddCommentParamsDto): Promise<ATSComment> {
    const user = await this.userRepository.findById(params.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userName = user.email || 'Unknown User';

    const comment = ATSComment.create({
      id: uuidv4(),
      applicationId: params.applicationId,
      comment: params.comment,
      addedBy: params.userId,
      addedByName: userName,
      stage: params.stage,
      subStage: params.subStage,
    });

    const savedComment = await this.commentRepository.create(comment);



    return ATSCommentMapper.toResponse(savedComment);
  }
}
