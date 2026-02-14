import { IUpdateInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IUpdateInterviewUseCase';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { NotFoundError, BadRequestError } from 'src/domain/errors/errors';
import { UpdateInterviewRequestDto } from 'src/application/dtos/application/interview/requests/update-interview.dto';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';

export class UpdateInterviewUseCase implements IUpdateInterviewUseCase {
  constructor(
    private _interviewRepository: IATSInterviewRepository,
    private _userRepository: IUserRepository,
  ) { }

  async execute(data: UpdateInterviewRequestDto): Promise<ATSInterviewResponseDto> {
    const user = await this._userRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    };

    const existingInterview = await this._interviewRepository.findById(data.interviewId);
    if (!existingInterview) {
      throw new NotFoundError('Interview not found');
    }

    if (existingInterview.status === 'cancelled' && data.status === 'completed') {
      throw new BadRequestError('Cannot mark a cancelled interview as completed');
    }

    if (existingInterview.status === 'completed' && data.status === 'cancelled') {
      throw new BadRequestError('Cannot cancel a completed interview');
    }

    if (data.rating !== undefined && existingInterview.rating !== undefined) {
      throw new BadRequestError('Interview rating has already been submitted');
    }

    if (data.feedback !== undefined && existingInterview.feedback !== undefined) {
      throw new BadRequestError('Interview feedback has already been submitted');
    }

    const interview = await this._interviewRepository.update(data.interviewId, {
      status: data.status,
      rating: data.rating,
      feedback: data.feedback,
    });

    if (!interview) {
      throw new NotFoundError('Interview not found');
    }

    return interview;
  }
}

