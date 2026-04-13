import { NextFunction, Request, Response } from 'express';
import { ICreateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/ICreateJobRoleUseCase';
import { IDeleteJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IDeleteJobRoleUseCase';
import { IGetAllJobRolesUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IGetAllJobRolesUseCase';
import { IGetJobRoleByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IGetJobRoleByIdUseCase';
import { IUpdateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IUpdateJobRoleUseCase';
import { CreateJobRoleDto } from 'src/application/dtos/admin/attributes/job-roles/requests/create-job-role-request.dto';
import { GetAllJobRolesQueryDtoSchema } from 'src/application/dtos/admin/attributes/job-roles/requests/get-all-job-roles-query.dto';
import { UpdateJobRoleDto } from 'src/application/dtos/admin/attributes/job-roles/requests/update-job-role-request.dto';
import { created, formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class AdminJobRoleController {
  constructor(
    @inject(TYPES.CreateJobRoleUseCase) private readonly _createJobRoleUseCase: ICreateJobRoleUseCase,
    @inject(TYPES.GetAllJobRolesUseCase) private readonly _getAllJobRolesUseCase: IGetAllJobRolesUseCase,
    @inject(TYPES.GetJobRoleByIdUseCase) private readonly _getJobRoleByIdUseCase: IGetJobRoleByIdUseCase,
    @inject(TYPES.UpdateJobRoleUseCase) private readonly _updateJobRoleUseCase: IUpdateJobRoleUseCase,
    @inject(TYPES.DeleteJobRoleUseCase) private readonly _deleteJobRoleUseCase: IDeleteJobRoleUseCase,
  ) { }

  createJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateJobRoleDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const jobRole = await this._createJobRoleUseCase.execute(parsed.data);
      created(res, jobRole, SUCCESS.CREATED('Job role'));
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
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Job roles'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const jobRole = await this._getJobRoleByIdUseCase.execute(id);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Job role'), jobRole);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedBody = UpdateJobRoleDto.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const { id } = req.params;
      const jobRole = await this._updateJobRoleUseCase.execute(id, parsedBody.data);
      sendSuccessResponse(res, SUCCESS.UPDATED('Job role'), jobRole);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._deleteJobRoleUseCase.execute(id);
      sendSuccessResponse(res, SUCCESS.DELETED('Job role'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}




