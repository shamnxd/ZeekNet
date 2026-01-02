import { Request, Response, NextFunction } from 'express';
import { CreateJobCategoryDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/create-job-category-request.dto';
import { UpdateJobCategoryDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/update-job-category-request.dto';
import { GetAllJobCategoriesDto, GetAllJobCategoriesRequestDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/get-all-job-categories-query.dto';
import { ICreateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/ICreateJobCategoryUseCase';
import { IGetAllJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IGetAllJobCategoriesUseCase';
import { IGetJobCategoryByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IGetJobCategoryByIdUseCase';
import { IUpdateJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IUpdateJobCategoryUseCase';
import { IDeleteJobCategoryUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IDeleteJobCategoryUseCase';
import { handleValidationError, handleAsyncError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminJobCategoryController {
  constructor(
    private readonly _createJobCategoryUseCase: ICreateJobCategoryUseCase,
    private readonly _getAllJobCategoriesUseCase: IGetAllJobCategoriesUseCase,
    private readonly _getJobCategoryByIdUseCase: IGetJobCategoryByIdUseCase,
    private readonly _updateJobCategoryUseCase: IUpdateJobCategoryUseCase,
    private readonly _deleteJobCategoryUseCase: IDeleteJobCategoryUseCase,
  ) {}

  createJobCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateJobCategoryDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const category = await this._createJobCategoryUseCase.execute(parsed.data.name);
      sendSuccessResponse(res, 'Category created successfully', category);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as GetAllJobCategoriesRequestDto;
      const result = await this._getAllJobCategoriesUseCase.execute(query);
      sendSuccessResponse(res, 'Categories retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Category ID is required', next);
    }

    try {
      const category = await this._getJobCategoryByIdUseCase.execute(id);
      sendSuccessResponse(res, 'Category retrieved successfully', category);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Category ID is required', next);
    }

    const parsed = UpdateJobCategoryDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const category = await this._updateJobCategoryUseCase.execute(id, parsed.data.name);
      sendSuccessResponse(res, 'Category updated successfully', category);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJobCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Category ID is required', next);
    }

    try {
      await this._deleteJobCategoryUseCase.execute(id);
      sendSuccessResponse(res, 'Category deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

