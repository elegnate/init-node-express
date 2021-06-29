import {
    JsonController,
    Get,
    Put,
    Post,
    Delete,
    HttpCode,
    Param,
    Body,
    Res,
    UseBefore,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
    InternalServerError,
    Req,
} from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';
import { CreateUserDTO, UpdateUserDTO, ResponseUserDTO } from '../dtos/UserDTO';
import { UserService } from '../services/UserService';
import { compareAuthToken, getAuthTokenBody, ITokenBody } from '../middlewares/JWTMiddleware';
import { UserModel } from '../models/UserModel';

@JsonController('/users')
@Service()
export class UserController {
    constructor(private userService: UserService) {}

    @HttpCode(200)
    @Get('/')
    public async getUsers(): Promise<UserModel[]> {
        const users = await this.userService.getUsers();
        return users;
    }

    @HttpCode(201)
    @Post('/')
    public async createUser(@Body() createUserDTO: CreateUserDTO): Promise<ResponseUserDTO> {
        if (await this.userService.getUserById(createUserDTO.id))
            throw new BadRequestError('ALREADY_EXIST_ID');

        const user: UserModel = await this.userService.createUser(createUserDTO);
        if (!user) throw new InternalServerError('DB_ERROR');

        const responseUser: ResponseUserDTO = new ResponseUserDTO();
        responseUser.id = user.id;
        responseUser.name = user.name;
        responseUser.createAt = user.createAt;
        return responseUser;
    }

    @HttpCode(200)
    @Get('/:id')
    public async getUser(@Param('id') id: string, @Req() req: Request): Promise<ResponseUserDTO> {
        const user = await this.userService.getUserById(id);
        if (!user) throw new NotFoundError('NOT_FOUND_ID');
        const responseUser: ResponseUserDTO = new ResponseUserDTO();
        responseUser.id = user.id;
        responseUser.name = user.name;

        const tokenBody: ITokenBody = getAuthTokenBody(req);
        if (tokenBody) {
            if (tokenBody.id === user.id) {
                responseUser.createAt = user.createAt;
                responseUser.accessableIp = user.accessableIp;
                responseUser.phone = user.phone;
                responseUser.createAt = user.createAt;
                responseUser.updateAt = user.updateAt;
            }
        }
        return responseUser;
    }

    @HttpCode(200)
    @Put('/:id')
    @UseBefore(compareAuthToken)
    public async updateUser(
        @Param('id') id: string,
        @Body() updateUserDTO: UpdateUserDTO,
        @Res() res: Response,
    ): Promise<ResponseUserDTO> {
        const sessionId: string = res.locals.jwtPayload?.id;
        if (sessionId !== id) throw new ForbiddenError('INVALID_ACCESS');
        const user = await this.userService.updateUser(sessionId, updateUserDTO);
        if (!user) throw new NotFoundError('NOT_FOUND_ID');

        const responseUser: ResponseUserDTO = new ResponseUserDTO();
        responseUser.id = user.id;
        responseUser.name = user.name;
        responseUser.createAt = user.createAt;
        return responseUser;
    }

    @HttpCode(204)
    @Delete('/:id')
    @UseBefore(compareAuthToken)
    public async deleteUser(@Param('id') id: string, @Res() res: Response): Promise<void> {
        const sessionId: string = res.locals.jwtPayload?.id;
        if (sessionId !== id) throw new ForbiddenError('INVALID_ACCESS');
        await this.userService.deleteUser(sessionId);
    }
}
