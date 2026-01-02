import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendNotFoundResponse,
} from 'src/shared/utils/presentation/controller.utils';
import { UpdateCompanyContactDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';
import { IGetCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IGetCompanyContactUseCase';
import { IUpsertCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IUpsertCompanyContactUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';

export class CompanyContactController {
  constructor(
    private readonly _getCompanyContactUseCase: IGetCompanyContactUseCase,
    private readonly _upsertCompanyContactUseCase: IUpsertCompanyContactUseCase,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  getCompanyContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const contact = await this._getCompanyContactUseCase.execute(companyId);
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

      const contact = await this._upsertCompanyContactUseCase.execute({ companyId, ...parsed.data });
      const message = contact.id ? 'Company contact updated successfully' : 'Company contact created successfully';
      sendSuccessResponse(res, message, contact);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


