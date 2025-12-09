import { Request, Response, NextFunction } from 'express';
import { IUpdateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/IUpdateJobRoleUseCase';
import { IDeleteJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/IDeleteJobRoleUseCase';
import { IGetJobRoleByIdUseCase } from 'src/domain/interfaces/use-cases/admin/IGetJobRoleByIdUseCase';
import { IGetAllJobRolesUseCase } from 'src/domain/interfaces/use-cases/admin/IGetAllJobRolesUseCase';
import { ICreateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/ICreateJobRoleUseCase';
import { GetAllJobRolesRequestDto } from '../../../application/dto/admin/job-role-management.dto';
import { handleValidationError, handleAsyncError, sendSuccessResponse, created } from '../../../shared/utils/controller.utils';

export class AdminJobRoleController {
  constructor(
    private readonly _createJobRoleUseCase: ICreateJobRoleUseCase,
    private readonly _getAllJobRolesUseCase: IGetAllJobRolesUseCase,
    private readonly _getJobRoleByIdUseCase: IGetJobRoleByIdUseCase,
    private readonly _updateJobRoleUseCase: IUpdateJobRoleUseCase,
    private readonly _deleteJobRoleUseCase: IDeleteJobRoleUseCase,
  ) {}

  createJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobRole = await this._createJobRoleUseCase.execute(req.body.name);
      created(res, jobRole, 'Job role created successfully');
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as GetAllJobRolesRequestDto;
      const result = await this._getAllJobRolesUseCase.execute(query);
      sendSuccessResponse(res, 'Job roles retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Job role ID is required', next);
    }

    try {
      const jobRole = await this._getJobRoleByIdUseCase.execute(id);
      sendSuccessResponse(res, 'Job role retrieved successfully', jobRole);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Job role ID is required', next);
    }

    try {
      const jobRole = await this._updateJobRoleUseCase.execute(id, req.body.name);
      sendSuccessResponse(res, 'Job role updated successfully', jobRole);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Job role ID is required', next);
    }

    try {
      await this._deleteJobRoleUseCase.execute(id);
      sendSuccessResponse(res, 'Job role deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

