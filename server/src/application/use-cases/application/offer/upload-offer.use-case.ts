import { v4 as uuidv4 } from 'uuid';
import { IUploadOfferUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUploadOfferUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { UploadOfferRequestDto } from 'src/application/dtos/application/offer/requests/upload-offer.dto';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';
import { ATSOfferMapper } from 'src/application/mappers/ats/ats-offer.mapper';

export class UploadOfferUseCase implements IUploadOfferUseCase {
  constructor(
    private readonly _offerRepository: IATSOfferRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _activityLoggerService: IActivityLoggerService,
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(dto: UploadOfferRequestDto): Promise<ATSOfferResponseDto> {

    const currentUser = await this._userRepository.findById(dto.performedBy);
    const performedByName = currentUser ? currentUser.name : 'Unknown';

    const offer = ATSOffer.create({
      id: uuidv4(),
      applicationId: dto.applicationId,
      documentUrl: dto.documentUrl || '', // Handling optional/required mapping
      documentFilename: dto.documentFilename || '',
      offerAmount: dto.offerAmount,
      status: 'sent',
      uploadedBy: dto.performedBy,
      uploadedByName: performedByName,
      sentAt: new Date(),
    });

    const savedOffer = await this._offerRepository.create(offer);


    const application = await this._jobApplicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }


    await this._activityLoggerService.logOfferSentActivity({
      applicationId: dto.applicationId,
      offerId: savedOffer.id,
      offerAmount: dto.offerAmount,
      stage: application.stage,
      subStage: application.subStage,
      performedBy: dto.performedBy,
      performedByName: performedByName,
    });

    return ATSOfferMapper.toResponse(savedOffer);
  }
}
