import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendNotFoundResponse,
} from '../../../shared/utils/controller.utils';
import { ICompanyContactUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { UpdateCompanyContactDto } from '../../../application/dto/company/company-contact.dto';
import { GetCompanyIdByUserIdUseCase } from '../../../application/use-cases/company/get-company-id-by-user-id.use-case';

export class CompanyContactController {
  constructor(
    private readonly _companyContactUseCase: ICompanyContactUseCase,
    private readonly _getCompanyIdByUserIdUseCase: GetCompanyIdByUserIdUseCase,
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
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const parsed = UpdateCompanyContactDto.safeParse(req.body);
      if (!parsed.success) {
        return handleValidationError(`Invalid contact data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
      }

      const existingContacts = await this._companyContactUseCase.getContactsByCompanyId(companyId);

      if (existingContacts.length > 0) {
        const contact = await this._companyContactUseCase.updateContact(existingContacts[0].id, parsed.data);
        sendSuccessResponse(res, 'Company contact updated successfully', contact);
      } else {
        const contact = await this._companyContactUseCase.createContact(companyId, parsed.data);
        sendSuccessResponse(res, 'Company contact created successfully', contact);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
