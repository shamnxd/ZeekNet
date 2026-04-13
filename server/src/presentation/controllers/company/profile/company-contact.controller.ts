import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { UpdateCompanyContactDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';
import { IGetCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IGetCompanyContactUseCase';
import { IUpsertCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IUpsertCompanyContactUseCase';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CompanyContactController {
  constructor(
    @inject(TYPES.GetCompanyContactUseCase) private readonly _getCompanyContactUseCase: IGetCompanyContactUseCase,
    @inject(TYPES.UpsertCompanyContactUseCase) private readonly _upsertCompanyContactUseCase: IUpsertCompanyContactUseCase,
  ) { }

  getCompanyContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const contact = await this._getCompanyContactUseCase.execute({ userId });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Company contact'), contact);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const bodySchema = UpdateCompanyContactDto.omit({ userId: true });
    const parsed = bodySchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const contact = await this._upsertCompanyContactUseCase.execute({ userId, ...parsed.data });
      const message = contact.id ? SUCCESS.UPDATED('Company contact') : SUCCESS.CREATED('Company contact');
      sendSuccessResponse(res, message, contact);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

