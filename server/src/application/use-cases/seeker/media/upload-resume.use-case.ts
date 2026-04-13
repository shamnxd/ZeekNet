import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ResumeMeta } from 'src/domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { ResumeMetaResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UploadResumeRequestDto } from 'src/application/dtos/seeker/media/requests/seeker-profile.dto';
import { IUploadResumeUseCase } from 'src/domain/interfaces/use-cases/seeker/media/IUploadResumeUseCase';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class UploadResumeUseCase implements IUploadResumeUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
  ) {}

  async execute(dto: UploadResumeRequestDto): Promise<ResumeMetaResponseDto> {
    const { userId } = dto;
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = dto.fileName.toLowerCase().substring(dto.fileName.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      throw new ValidationError('Resume must be a PDF, DOC, or DOCX file');
    }

    const resume = SeekerProfileMapper.toResumeEntity({
      url: dto.url,
      fileName: dto.fileName,
      uploadedAt: new Date(),
    });

    await this._seekerProfileRepository.update(profile.id, { resume });
    return SeekerProfileMapper.resumeMetaToResponse(resume);
  }
}




