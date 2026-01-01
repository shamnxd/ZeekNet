import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendNotFoundResponse,
} from '../../../shared/utils/presentation/controller.utils';
import { ICreateCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/ICreateCompanyWorkplacePictureUseCase';
import { IUpdateCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IUpdateCompanyWorkplacePictureUseCase';
import { IDeleteCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IDeleteCompanyWorkplacePictureUseCase';
import { IGetCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyWorkplacePictureUseCase';
import { CreateCompanyWorkplacePicturesDto, UpdateCompanyWorkplacePicturesDto } from '../../../application/dtos/company/common/company-workplace-pictures.dto';
import { IGetCompanyIdByUserIdUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyIdByUserIdUseCase';

export class CompanyWorkplacePictureController {
  constructor(
    private readonly _createCompanyWorkplacePictureUseCase: ICreateCompanyWorkplacePictureUseCase,
    private readonly _updateCompanyWorkplacePictureUseCase: IUpdateCompanyWorkplacePictureUseCase,
    private readonly _deleteCompanyWorkplacePictureUseCase: IDeleteCompanyWorkplacePictureUseCase,
    private readonly _getCompanyWorkplacePictureUseCase: IGetCompanyWorkplacePictureUseCase,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  getCompanyWorkplacePictures = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const pictures = await this._getCompanyWorkplacePictureUseCase.execute(companyId);
      sendSuccessResponse(res, 'Company workplace pictures retrieved successfully', pictures);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyWorkplacePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyWorkplacePicturesDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid workplace picture data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const picture = await this._createCompanyWorkplacePictureUseCase.execute({ ...parsed.data, companyId });
      sendSuccessResponse(res, 'Workplace picture created successfully', picture, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyWorkplacePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyWorkplacePicturesDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid workplace picture data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      const picture = await this._updateCompanyWorkplacePictureUseCase.execute(companyId, id, parsed.data);
      sendSuccessResponse(res, 'Workplace picture updated successfully', picture);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyWorkplacePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      await this._deleteCompanyWorkplacePictureUseCase.execute(companyId, id);
      sendSuccessResponse(res, 'Workplace picture deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


