import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ResumeMeta } from '../../../domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { ResumeMetaResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { UploadResumeRequestDto } from '../../dto/seeker/seeker-profile.dto';
import { IUploadResumeUseCase } from 'src/domain/interfaces/use-cases/seeker/IUploadResumeUseCase';

export class UploadResumeUseCase implements IUploadResumeUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
  ) {}

  async execute(dto: UploadResumeRequestDto): Promise<ResumeMetaResponseDto> {
    const { userId } = dto;
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = dto.fileName.toLowerCase().substring(dto.fileName.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      throw new ValidationError('Resume must be a PDF, DOC, or DOCX file');
    }

    const resume: ResumeMeta = {
      url: dto.url,
      fileName: dto.fileName,
      uploadedAt: new Date(),
    };

    await this._seekerProfileRepository.update(profile.id, { resume });
    return SeekerProfileMapper.resumeMetaToResponse(resume);
  }
}


