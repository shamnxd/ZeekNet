import { NextFunction, Request, Response } from 'express';
import { ICreateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/ICreateJobRoleUseCase';
import { IDeleteJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IDeleteJobRoleUseCase';
import { IGetAllJobRolesUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IGetAllJobRolesUseCase';
import { IGetJobRoleByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IGetJobRoleByIdUseCase';
import { IUpdateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IUpdateJobRoleUseCase';
import { ParamsWithIdDto } from 'src/application/dtos/common/params-with-id.dto';
import { CreateJobRoleDto } from 'src/application/dtos/admin/attributes/job-roles/requests/create-job-role-request.dto';
import { GetAllJobRolesQueryDtoSchema } from 'src/application/dtos/admin/attributes/job-roles/requests/get-all-job-roles-query.dto';
import { UpdateJobRoleDto } from 'src/application/dtos/admin/attributes/job-roles/requests/update-job-role-request.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { created, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminJobRoleController {
  constructor(
    private readonly _createJobRoleUseCase: ICreateJobRoleUseCase,
    private readonly _getAllJobRolesUseCase: IGetAllJobRolesUseCase,
    private readonly _getJobRoleByIdUseCase: IGetJobRoleByIdUseCase,
    private readonly _updateJobRoleUseCase: IUpdateJobRoleUseCase,
    private readonly _deleteJobRoleUseCase: IDeleteJobRoleUseCase,
  ) { }

  createJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateJobRoleDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const jobRole = await this._createJobRoleUseCase.execute(parsed.data);
      created(res, jobRole, 'Job role created successfully');
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllJobRolesQueryDtoSchema.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllJobRolesUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Job roles retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    try {
      const jobRole = await this._getJobRoleByIdUseCase.execute(parsedParams.data.id);
      sendSuccessResponse(res, 'Job role retrieved successfully', jobRole);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    const parsedBody = UpdateJobRoleDto.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const jobRole = await this._updateJobRoleUseCase.execute(
        parsedParams.data.id,
        parsedBody.data
      );
      sendSuccessResponse(res, 'Job role updated successfully', jobRole);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    try {
      await this._deleteJobRoleUseCase.execute(parsedParams.data.id);
      sendSuccessResponse(res, 'Job role deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



