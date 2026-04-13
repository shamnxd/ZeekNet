import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { ICreateCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/ICreateCompanyWorkplacePictureUseCase';
import { IUpdateCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IUpdateCompanyWorkplacePictureUseCase';
import { IDeleteCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IDeleteCompanyWorkplacePictureUseCase';
import { IGetCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IGetCompanyWorkplacePictureUseCase';
import { CreateCompanyWorkplacePicturesDto, UpdateCompanyWorkplacePicturesDto } from 'src/application/dtos/company/media/requests/company-workplace-pictures.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId, sendCreatedResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CompanyWorkplacePictureController {
  constructor(
    @inject(TYPES.CreateCompanyWorkplacePictureUseCase) private readonly _createCompanyWorkplacePictureUseCase: ICreateCompanyWorkplacePictureUseCase,
    @inject(TYPES.UpdateCompanyWorkplacePictureUseCase) private readonly _updateCompanyWorkplacePictureUseCase: IUpdateCompanyWorkplacePictureUseCase,
    @inject(TYPES.DeleteCompanyWorkplacePictureUseCase) private readonly _deleteCompanyWorkplacePictureUseCase: IDeleteCompanyWorkplacePictureUseCase,
    @inject(TYPES.GetCompanyWorkplacePictureUseCase) private readonly _getCompanyWorkplacePictureUseCase: IGetCompanyWorkplacePictureUseCase,
  ) { }

  getCompanyWorkplacePictures = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const pictures = await this._getCompanyWorkplacePictureUseCase.execute({ userId });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Workplace pictures'), pictures);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyWorkplacePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyWorkplacePicturesDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const picture = await this._createCompanyWorkplacePictureUseCase.execute({ userId, ...parsed.data });
      sendCreatedResponse(res, SUCCESS.CREATED('Workplace picture'), picture);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyWorkplacePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyWorkplacePicturesDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      const picture = await this._updateCompanyWorkplacePictureUseCase.execute({
        userId,
        pictureId: id,
        ...parsed.data,
      });
      sendSuccessResponse(res, SUCCESS.UPDATED('Workplace picture'), picture);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyWorkplacePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._deleteCompanyWorkplacePictureUseCase.execute({
        userId,
        pictureId: id,
      });
      sendSuccessResponse(res, SUCCESS.DELETED('Workplace picture'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



