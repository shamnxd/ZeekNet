import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSOfferRepository } from '../../../domain/interfaces/repositories/ats/IATSOfferRepository';
import { NotFoundError, AuthorizationError, ValidationError } from '../../../domain/errors/errors';
import { ATSOffer } from '../../../domain/entities/ats-offer.entity';

export interface IUpdateOfferStatusUseCase {
  execute(userId: string, offerId: string, status: 'signed' | 'declined'): Promise<ATSOffer>;
}

export class UpdateOfferStatusUseCase implements IUpdateOfferStatusUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _offerRepository: IATSOfferRepository,
  ) {}

  async execute(userId: string, offerId: string, status: 'signed' | 'declined'): Promise<ATSOffer> {
    if (!status || !['signed', 'declined'].includes(status)) {
      throw new ValidationError('Invalid status. Must be "signed" or "declined"');
    }

    const offer = await this._offerRepository.findById(offerId);
    if (!offer) {
      throw new NotFoundError('Offer not found');
    }

    const application = await this._jobApplicationRepository.findById(offer.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only update offers for your own applications');
    }

    const updateData: Partial<ATSOffer> & { status: 'signed' | 'declined'; signedAt?: Date; declinedAt?: Date } = {
      status,
    };

    if (status === 'signed') {
      updateData.signedAt = new Date();
    } else if (status === 'declined') {
      updateData.declinedAt = new Date();
    }

    const updatedOffer = await this._offerRepository.update(offerId, updateData);

    if (!updatedOffer) {
      throw new NotFoundError('Failed to update offer');
    }

    return updatedOffer;
  }
}
