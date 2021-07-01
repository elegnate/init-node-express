import {
    JsonController,
    Post,
    HttpCode,
    Body,
    Res,
    UseBefore,
    BadRequestError,
} from 'routing-controllers';
import { Service } from 'typedi';
import { Response } from 'express';
import { LoginUserDTO, ResponseUserDTO } from '../dtos/UserDTO';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { compareAuthToken, generateAuthToken } from '../middlewares/JWTMiddleware';
import { UserModel } from '../models/UserModel';

@JsonController('/auth')
@Service()
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) {}

    @HttpCode(200)
    @Post('/login')
    public async login(@Body() loginUserDTO: LoginUserDTO): Promise<ResponseUserDTO> {
        const user: UserModel = await this.authService.login(loginUserDTO);
        const responseUser: ResponseUserDTO = new ResponseUserDTO();
        responseUser.id = user.id;
        responseUser.name = user.name;
        responseUser.createAt = user.createAt;
        responseUser.auth = user.auth;
        responseUser.phone = user.phone;
        responseUser.accessableIp = user.accessableIp;
        responseUser.updateAt = user.updateAt;
        responseUser.token = await generateAuthToken(user);
        return responseUser;
    }

    @HttpCode(201)
    @Post('/token')
    @UseBefore(compareAuthToken)
    public async refreshToken(@Res() res: Response): Promise<ResponseUserDTO> {
        const sessionId: string = res.locals.jwtPayload?.id;
        const user = await this.userService.getUserById(sessionId);
        if (!user) throw new BadRequestError('NOT_FOUND_ID');

        const responseUser: ResponseUserDTO = new ResponseUserDTO();
        responseUser.token = await generateAuthToken(user);
        return responseUser;
    }
}
