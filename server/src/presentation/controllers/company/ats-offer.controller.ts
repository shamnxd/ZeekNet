import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { IUploadOfferUseCase } from '../../../domain/interfaces/use-cases/ats/IUploadOfferUseCase';
import { IUpdateOfferStatusUseCase } from '../../../domain/interfaces/use-cases/ats/IUpdateOfferStatusUseCase';
import { IGetOffersByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetOffersByApplicationUseCase';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { IFileUrlService } from '../../../domain/interfaces/services/IFileUrlService';
import { sendSuccessResponse, sendCreatedResponse, sendBadRequestResponse, sendNotFoundResponse, sendInternalServerErrorResponse } from '../../../shared/utils/controller.utils';
import { UploadService } from '../../../shared/services/upload.service';
import { UploadOfferDto } from '../../../application/dto/ats/upload-offer.dto';
import { UpdateOfferStatusDto } from '../../../application/dto/ats/update-offer-status.dto';
import { ATSOffer } from '../../../domain/entities/ats-offer.entity';

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

      // Upload document to S3 if file is provided
      let documentUrl: string;
      let documentFilename: string;

      if (req.file) {
        const uploadResult = await UploadService.handleOfferLetterUpload(req, this.s3Service, 'document');
        documentUrl = uploadResult.url; // This is the S3 key
        documentFilename = uploadResult.filename;
      } else if (dto.documentUrl && dto.documentFilename) {
        // Fallback to provided URL if no file uploaded (for backward compatibility)
        documentUrl = dto.documentUrl;
        documentFilename = dto.documentFilename;
      } else {
        sendBadRequestResponse(res, 'Document file is required');
        return;
      }

      const offer = await this.uploadOfferUseCase.execute({
        applicationId: dto.applicationId,
        documentUrl: documentUrl, // Store S3 key
        documentFilename: documentFilename,
        offerAmount: dto.offerAmount,
        uploadedBy: userId,
        uploadedByName: userName,
      });

      // Generate signed URL for response
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

      // Generate signed URLs for all offers
      const offersWithSignedUrls = await Promise.all(
        offers.map(async (offer) => {
          try {
            const signedUrl = await this.fileUrlService.getSignedUrl(offer.documentUrl);
            const offerObj: ATSOffer & { documentUrl: string; signedDocumentUrl?: string } = {
              ...offer,
              documentUrl: signedUrl,
            };
            
            // Generate signed URL for signed document if it exists
            if (offer.signedDocumentUrl) {
              const signedDocUrl = await this.fileUrlService.getSignedUrl(offer.signedDocumentUrl);
              offerObj.signedDocumentUrl = signedDocUrl;
            }
            
            return offerObj;
          } catch (error: unknown) {
            console.error(`Error generating signed URL for offer ${offer.id}:`, error);
            // Return offer without signed URL if generation fails
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

