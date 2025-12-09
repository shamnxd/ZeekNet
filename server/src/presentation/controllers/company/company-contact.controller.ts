import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendNotFoundResponse,
} from '../../../shared/utils/controller.utils';
import { ICompanyContactUseCase, IGetCompanyIdByUserIdUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { UpdateCompanyContactDto } from '../../../application/dto/company/company-contact.dto';

export class CompanyContactController {
  constructor(
    private readonly _companyContactUseCase: ICompanyContactUseCase,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  getCompanyContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const contact = await this._companyContactUseCase.getContactsByCompanyId(companyId);
      sendSuccessResponse(res, 'Company contact retrieved successfully', contact);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyContactDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid contact data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const contact = await this._companyContactUseCase.upsertContact({ companyId, ...parsed.data });
      const message = contact.id ? 'Company contact updated successfully' : 'Company contact created successfully';
      sendSuccessResponse(res, message, contact);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
