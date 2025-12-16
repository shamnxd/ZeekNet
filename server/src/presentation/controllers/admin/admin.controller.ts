import { Request, Response, NextFunction } from 'express';
import { GetAllUsersQueryDto } from '../../../application/dto/admin/get-all-users-query.dto';
import { GetCompaniesQueryDto } from '../../../application/dto/company/get-companies-query.dto';
import { IGetCompanyByIdUseCase } from 'src/domain/interfaces/use-cases/admin/IGetCompanyByIdUseCase';
import { IGetPendingCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/IGetPendingCompaniesUseCase';
import { IVerifyCompanyUseCase } from 'src/domain/interfaces/use-cases/admin/IVerifyCompanyUseCase';
import { IGetCompaniesWithVerificationUseCase } from 'src/domain/interfaces/use-cases/admin/IGetCompaniesWithVerificationUseCase';
import { IGetAllCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/IGetAllCompaniesUseCase';
import { IAdminGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/admin/IAdminGetUserByIdUseCase';
import { IBlockUserUseCase } from 'src/domain/interfaces/use-cases/admin/IBlockUserUseCase';
import { IGetAllUsersUseCase } from 'src/domain/interfaces/use-cases/admin/IGetAllUsersUseCase';
import { handleValidationError, handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';

export class AdminController {
  constructor(
    private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
    private readonly _blockUserUseCase: IBlockUserUseCase,
    private readonly _getUserByIdUseCase: IAdminGetUserByIdUseCase,
    private readonly _getAllCompaniesUseCase: IGetAllCompaniesUseCase,
    private readonly _getCompaniesWithVerificationUseCase: IGetCompaniesWithVerificationUseCase,
    private readonly _verifyCompanyUseCase: IVerifyCompanyUseCase,
    private readonly _getPendingCompaniesUseCase: IGetPendingCompaniesUseCase,
    private readonly _getCompanyByIdUseCase: IGetCompanyByIdUseCase,
  ) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as GetAllUsersQueryDto;
      const sortOrder = query && typeof (query as Partial<GetAllUsersQueryDto> & { sortOrder?: string }).sortOrder === 'string'
        && ['asc', 'desc'].includes((query as { sortOrder?: string }).sortOrder!)
        ? ((query as { sortOrder?: 'asc' | 'desc' }).sortOrder as 'asc' | 'desc')
        : 'desc';
      const result = await this._getAllUsersUseCase.execute({ ...query, sortOrder });
      sendSuccessResponse(res, 'Users retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, isBlocked } = req.body;
    if (!userId || typeof userId !== 'string') {
      return handleValidationError('User ID is required and must be a string', next);
    }
    if (typeof isBlocked !== 'boolean') {
      return handleValidationError('isBlocked is required and must be a boolean', next);
    }

    try {
      await this._blockUserUseCase.execute(userId, isBlocked);
      const message = `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.params;
    if (!userId) {
      return handleValidationError('User ID is required', next);
    }

    try {
      const user = await this._getUserByIdUseCase.execute(userId);
      sendSuccessResponse(res, 'User retrieved successfully', user);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as GetCompaniesQueryDto;
      const result = await this._getAllCompaniesUseCase.execute(query);
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
    const { companyId } = req.params;
    if (!companyId) {
      return handleValidationError('Company ID is required', next);
    }

    try {
      const company = await this._getCompanyByIdUseCase.execute(companyId);
      sendSuccessResponse(res, 'Company retrieved successfully', company);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  verifyCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { companyId, isVerified, rejection_reason } = req.body;
    if (!companyId || typeof companyId !== 'string') {
      return handleValidationError('Company ID is required and must be a string', next);
    }
    if (!isVerified || !['pending', 'rejected', 'verified'].includes(isVerified)) {
      return handleValidationError('isVerified must be one of: pending, rejected, verified', next);
    }

    try {
      await this._verifyCompanyUseCase.execute(companyId, isVerified, rejection_reason);
      const message = `Company ${isVerified} successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}