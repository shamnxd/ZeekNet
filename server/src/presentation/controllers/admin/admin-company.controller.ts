import { NextFunction, Request, Response } from 'express';
import { IGetAllCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetAllCompaniesUseCase';
import { IGetCompanyByIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyByIdUseCase';
import { IGetPendingCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetPendingCompaniesUseCase';
import { IVerifyCompanyUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IVerifyCompanyUseCase';
import { ParamsWithIdDto } from 'src/application/dtos/common/params-with-id.dto';
import { GetCompaniesQueryDtoSchema } from 'src/application/dtos/admin/companies/requests/get-companies-query.dto';
import { VerifyCompanyDto } from 'src/application/dtos/admin/companies/requests/verify-company-request.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminCompanyController {
    constructor(
        private readonly _getAllCompaniesUseCase: IGetAllCompaniesUseCase,
        private readonly _getPendingCompaniesUseCase: IGetPendingCompaniesUseCase,
        private readonly _getCompanyByIdUseCase: IGetCompanyByIdUseCase,
        private readonly _verifyCompanyUseCase: IVerifyCompanyUseCase,
    ) { }

    getAllCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const parsed = GetCompaniesQueryDtoSchema.safeParse(req.query);
        if (!parsed.success) {
            return handleValidationError(formatZodErrors(parsed.error), next);
        }

        try {
            const result = await this._getAllCompaniesUseCase.execute(parsed.data);
            sendSuccessResponse(res, 'Companies retrieved successfully', result);
        } catch (error) {
            handleAsyncError(error, next);
        }
    };

    getPendingCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this._getPendingCompaniesUseCase.execute();
            sendSuccessResponse(res, 'Pending companies retrieved successfully', result);
        } catch (error) {
            handleAsyncError(error, next);
        }
    };

    getCompanyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const parsedParams = ParamsWithIdDto.safeParse(req.params);
        if (!parsedParams.success) {
            return handleValidationError(formatZodErrors(parsedParams.error), next);
        }

        try {
            const company = await this._getCompanyByIdUseCase.execute(parsedParams.data.id);
            sendSuccessResponse(res, 'Company retrieved successfully', company);
        } catch (error) {
            handleAsyncError(error, next);
        }
    };

    verifyCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const parsed = VerifyCompanyDto.safeParse(req.body);
        if (!parsed.success) {
            return handleValidationError(formatZodErrors(parsed.error), next);
        }

        try {
            await this._verifyCompanyUseCase.execute(parsed.data);
            const message = `Company ${parsed.data.isVerified} successfully`;
            sendSuccessResponse(res, message, null);
        } catch (error) {
            handleAsyncError(error, next);
        }
    };
}
