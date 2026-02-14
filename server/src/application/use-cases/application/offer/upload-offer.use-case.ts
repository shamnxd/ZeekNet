import { v4 as uuidv4 } from 'uuid';
import { IUploadOfferUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUploadOfferUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';

import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { UploadOfferRequestDto } from 'src/application/dtos/application/offer/requests/upload-offer.dto';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';
import { ATSOfferMapper } from 'src/application/mappers/ats/ats-offer.mapper';

import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';

export class UploadOfferUseCase implements IUploadOfferUseCase {
  constructor(
    private readonly _offerRepository: IATSOfferRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _fileUploadService: IFileUploadService,
  ) { }

  async execute(dto: UploadOfferRequestDto): Promise<ATSOfferResponseDto> {
    let documentUrl = dto.documentUrl;

    if (dto.file) {
      const uploadResult = await this._fileUploadService.uploadOfferLetter(dto.file);
      documentUrl = uploadResult.url; // This is the S3 key
    }

    const offer = ATSOffer.create({
      id: uuidv4(),
      applicationId: dto.applicationId,
      documentUrl,
      offerAmount: dto.offerAmount,
      status: 'sent',
    });

    const savedOffer = await this._offerRepository.create(offer);

    const application = await this._jobApplicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    return ATSOfferMapper.toResponse(savedOffer);
  }
}
