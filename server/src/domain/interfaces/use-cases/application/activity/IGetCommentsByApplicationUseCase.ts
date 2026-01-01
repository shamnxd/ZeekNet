import { ATSComment } from 'src/domain/entities/ats-comment.entity';

export interface IGetCommentsByApplicationUseCase {
  execute(applicationId: string): Promise<ATSComment[]>;
}

