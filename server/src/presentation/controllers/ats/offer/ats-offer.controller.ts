import { Response } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IUploadOfferUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUploadOfferUseCase';
import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUpdateOfferStatusUseCase';
import { IGetOffersByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/offer/IGetOffersByApplicationUseCase';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { IFileUrlService } from 'src/domain/interfaces/services/IFileUrlService';
import { sendSuccessResponse, sendCreatedResponse, sendBadRequestResponse, sendNotFoundResponse, sendInternalServerErrorResponse } from 'src/shared/utils/presentation/controller.utils';
import { UploadService, UploadedFile } from 'src/shared/services/upload.service';
import { UploadOfferDto } from 'src/application/dtos/application/offer/requests/upload-offer.dto';
import { UpdateOfferStatusDto } from 'src/application/dtos/application/offer/requests/update-offer-status.dto';
import { ATSOffer } from 'src/domain/entities/ats-offer.entity';

export class ATSOfferController {
  constructor(
    private uploadOfferUseCase: IUploadOfferUseCase,
    private updateOfferStatusUseCase: IUpdateOfferStatusUseCase,
    private getOffersByApplicationUseCase: IGetOffersByApplicationUseCase,
    private s3Service: IS3Service,
    private fileUrlService: IFileUrlService,
  ) {}

  uploadOffer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const dto: UploadOfferDto = req.body;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      
      let documentUrl: string;
      let documentFilename: string;

      if (req.file) {
        const uploadResult = await UploadService.handleOfferLetterUpload(req.file as unknown as UploadedFile, this.s3Service, 'document');
        documentUrl = uploadResult.url; 
        documentFilename = uploadResult.filename;
      } else if (dto.documentUrl && dto.documentFilename) {
        
        documentUrl = dto.documentUrl;
        documentFilename = dto.documentFilename;
      } else {
        sendBadRequestResponse(res, 'Document file is required');
        return;
      }

      const offer = await this.uploadOfferUseCase.execute({
        applicationId: dto.applicationId,
        documentUrl: documentUrl, 
        documentFilename: documentFilename,
        offerAmount: dto.offerAmount,
        uploadedBy: userId,
        uploadedByName: userName,
      });

      
      const signedUrl = await this.fileUrlService.getSignedUrl(offer.documentUrl);
      const offerWithSignedUrl = {
        ...offer,
        documentUrl: signedUrl,
      };

      sendCreatedResponse(res, 'Offer uploaded successfully', offerWithSignedUrl);
    } catch (error) {
      console.error('Error uploading offer:', error);
      sendInternalServerErrorResponse(res, 'Failed to upload offer');
    }
  };

  updateOfferStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateOfferStatusDto = req.body;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      const offer = await this.updateOfferStatusUseCase.execute({
        offerId: id,
        status: dto.status,
        withdrawalReason: dto.withdrawalReason,
        performedBy: userId,
        performedByName: userName,
      });

      sendSuccessResponse(res, 'Offer status updated successfully', offer);
    } catch (error) {
      console.error('Error updating offer status:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        sendNotFoundResponse(res, error.message);
        return;
      }
      sendInternalServerErrorResponse(res, 'Failed to update offer status');
    }
  };

  getOffersByApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const offers = await this.getOffersByApplicationUseCase.execute(applicationId);

      
      const offersWithSignedUrls = await Promise.all(
        offers.map(async (offer) => {
          try {
            const signedUrl = await this.fileUrlService.getSignedUrl(offer.documentUrl);
            const offerObj: ATSOffer & { documentUrl: string; signedDocumentUrl?: string } = {
              ...offer,
              documentUrl: signedUrl,
            };
            
            
            if (offer.signedDocumentUrl) {
              const signedDocUrl = await this.fileUrlService.getSignedUrl(offer.signedDocumentUrl);
              offerObj.signedDocumentUrl = signedDocUrl;
            }
            
            return offerObj;
          } catch (error: unknown) {
            console.error(`Error generating signed URL for offer ${offer.id}:`, error);
            
            return offer;
          }
        }),
      );

      sendSuccessResponse(res, 'Offers retrieved successfully', offersWithSignedUrls);
    } catch (error) {
      console.error('Error fetching offers:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch offers');
    }
  };
}



