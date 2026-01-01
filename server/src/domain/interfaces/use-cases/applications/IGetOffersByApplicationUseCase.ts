import { OfferForSeekerDto } from '../../../../application/use-cases/seeker/get-offers-by-application.use-case';

export interface IGetOffersByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<OfferForSeekerDto[]>;
}
