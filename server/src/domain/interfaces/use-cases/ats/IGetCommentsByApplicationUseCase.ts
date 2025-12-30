import { ATSComment } from '../../../entities/ats-comment.entity';

export interface IGetCommentsByApplicationUseCase {
  execute(applicationId: string): Promise<ATSComment[]>;
}

