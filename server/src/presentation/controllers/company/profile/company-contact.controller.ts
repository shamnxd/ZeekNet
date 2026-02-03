import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from 'src/shared/utils/presentation/controller.utils';
import { UpdateCompanyContactDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';
import { IGetCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IGetCompanyContactUseCase';
import { IUpsertCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IUpsertCompanyContactUseCase';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class CompanyContactController {
  constructor(
    private readonly _getCompanyContactUseCase: IGetCompanyContactUseCase,
    private readonly _upsertCompanyContactUseCase: IUpsertCompanyContactUseCase,
  ) { }

  getCompanyContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const contact = await this._getCompanyContactUseCase.execute({ userId });
      sendSuccessResponse(res, 'Company contact retrieved successfully', contact);
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
      const message = contact.id ? 'Company contact updated successfully' : 'Company contact created successfully';
      sendSuccessResponse(res, message, contact);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
