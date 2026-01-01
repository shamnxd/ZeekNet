import { Request, Response, NextFunction } from 'express';
import { IUpdateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IUpdateJobRoleUseCase';
import { IDeleteJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IDeleteJobRoleUseCase';
import { IGetJobRoleByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IGetJobRoleByIdUseCase';
import { IGetAllJobRolesUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IGetAllJobRolesUseCase';
import { ICreateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/ICreateJobRoleUseCase';
import { GetAllJobRolesRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/get-all-job-roles-query.dto';
import { handleValidationError, handleAsyncError, sendSuccessResponse, created } from 'src/shared/utils/presentation/controller.utils';

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



