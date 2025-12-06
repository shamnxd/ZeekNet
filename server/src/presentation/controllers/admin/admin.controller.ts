import { Request, Response, NextFunction } from 'express';
import { BlockUserDto, CompanyVerificationDto } from '../../../application/dto/admin/user-management.dto';
import { GetAllUsersRequestDto, GetAllCompaniesRequestDto } from '../../../application/dto/admin/user-management.dto';
import { IAdminGetUserByIdUseCase, IGetAllUsersUseCase, IBlockUserUseCase, IGetAllCompaniesUseCase, IGetCompaniesWithVerificationUseCase, IVerifyCompanyUseCase, IGetPendingCompaniesUseCase, IGetCompanyByIdUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
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
      const query = req.query as unknown as GetAllUsersRequestDto;
      const result = await this._getAllUsersUseCase.execute(query);
      sendSuccessResponse(res, 'Users retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = BlockUserDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError('Invalid block user data', next);
    }

    try {
      await this._blockUserUseCase.execute(parsed.data.userId, parsed.data.isBlocked);
      const message = `User ${parsed.data.isBlocked ? 'blocked' : 'unblocked'} successfully`;
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
      const query = req.query as unknown as GetAllCompaniesRequestDto;
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
    const parsed = CompanyVerificationDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError('Invalid verification data', next);
    }

    try {
      await this._verifyCompanyUseCase.execute(
        parsed.data.companyId,
        parsed.data.isVerified,
        parsed.data.rejection_reason,
      );

      const message = `Company ${parsed.data.isVerified} successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}