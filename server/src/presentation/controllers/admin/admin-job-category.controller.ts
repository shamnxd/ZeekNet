import { NextFunction, Request, Response } from 'express';
import { ICreateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/ICreateJobCategoryUseCase';
import { IDeleteJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IDeleteJobCategoryUseCase';
import { IGetAllJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IGetAllJobCategoriesUseCase';
import { IGetJobCategoryByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IGetJobCategoryByIdUseCase';
import { IUpdateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IUpdateJobCategoryUseCase';
import { CreateJobCategoryDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/create-job-category-request.dto';
import { GetAllJobCategoriesQueryDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/get-all-job-categories-query.dto';
import { UpdateJobCategoryDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/update-job-category-request.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminJobCategoryController {
  constructor(
    private readonly _createJobCategoryUseCase: ICreateJobCategoryUseCase,
    private readonly _getAllJobCategoriesUseCase: IGetAllJobCategoriesUseCase,
    private readonly _getJobCategoryByIdUseCase: IGetJobCategoryByIdUseCase,
    private readonly _updateJobCategoryUseCase: IUpdateJobCategoryUseCase,
    private readonly _deleteJobCategoryUseCase: IDeleteJobCategoryUseCase,
  ) { }

  createJobCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateJobCategoryDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }
    try {
      const category = await this._createJobCategoryUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Category created successfully', category);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllJobCategoriesQueryDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }
    try {
      const result = await this._getAllJobCategoriesUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Categories retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this._getJobCategoryByIdUseCase.execute(id);
      sendSuccessResponse(res, 'Category retrieved successfully', category);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedBody = UpdateJobCategoryDto.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }
    try {
      const { id } = req.params;
      const category = await this._updateJobCategoryUseCase.execute(id, parsedBody.data);
      sendSuccessResponse(res, 'Category updated successfully', category);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJobCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._deleteJobCategoryUseCase.execute(id);
      sendSuccessResponse(res, 'Category deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}