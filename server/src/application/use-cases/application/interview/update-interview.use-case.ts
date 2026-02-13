import { IUpdateInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IUpdateInterviewUseCase';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';

import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ATSInterview } from 'src/domain/entities/ats-interview.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { UpdateInterviewRequestDto } from 'src/application/dtos/application/interview/requests/update-interview.dto';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';

export class UpdateInterviewUseCase implements IUpdateInterviewUseCase {
  constructor(
    private _interviewRepository: IATSInterviewRepository,
    private _jobApplicationRepository: IJobApplicationRepository,

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

