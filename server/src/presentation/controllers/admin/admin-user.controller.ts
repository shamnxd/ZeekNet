import { NextFunction, Request, Response } from 'express';
import { IAdminGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/admin/user/IAdminGetUserByIdUseCase';
import { IBlockUserUseCase } from 'src/domain/interfaces/use-cases/admin/user/IBlockUserUseCase';
import { IGetAllUsersUseCase } from 'src/domain/interfaces/use-cases/admin/user/IGetAllUsersUseCase';
import { ParamsWithIdDto } from 'src/application/dtos/common/params-with-id.dto';
import { BlockUserDto } from 'src/application/dtos/admin/user/requests/block-user-request.dto';
import { GetUsersQueryDtoSchema } from 'src/application/dtos/admin/user/requests/get-users-query.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminUserController {
    constructor(
        private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
        private readonly _getUserByIdUseCase: IAdminGetUserByIdUseCase,
        private readonly _blockUserUseCase: IBlockUserUseCase,
    ) { }

    getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const parsed = GetUsersQueryDtoSchema.safeParse(req.query);
        if (!parsed.success) {
            return handleValidationError(formatZodErrors(parsed.error), next);
        }

        try {
            const result = await this._getAllUsersUseCase.execute(parsed.data);
            sendSuccessResponse(res, 'Users retrieved successfully', result);
        } catch (error) {
            handleAsyncError(error, next);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const parsedParams = ParamsWithIdDto.safeParse(req.params);
        if (!parsedParams.success) {
            return handleValidationError(formatZodErrors(parsedParams.error), next);
        }

        try {
            const user = await this._getUserByIdUseCase.execute(parsedParams.data.id);
            sendSuccessResponse(res, 'User retrieved successfully', user);
        } catch (error) {
            handleAsyncError(error, next);
        }
    };

    blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const parsed = BlockUserDto.safeParse(req.body);
        if (!parsed.success) {
            return handleValidationError(formatZodErrors(parsed.error), next);
        }

        try {
            await this._blockUserUseCase.execute(parsed.data.userId, parsed.data.isBlocked);
            const message = `User ${parsed.data.isBlocked ? 'blocked' : 'unblocked'} successfully`;
            sendSuccessResponse(res, message, null);
        } catch (error) {
            handleAsyncError(error, next);
        }
    };
}
