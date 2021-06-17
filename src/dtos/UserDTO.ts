import { IsNotEmpty, Length } from 'class-validator';
import { UserModel } from '../models/UserModel';

export class CreateUserDTO {
    @IsNotEmpty({ message: 'EMPTY_PARAM_ID' })
    @Length(5, 50, { message: 'INVALID_PARAM_ID' })
    public id: string;

    @IsNotEmpty({ message: 'EMPTY_PARAM_NAME' })
    @Length(3, 20, { message: 'INVALID_PARAM_NAME' })
    public name: string;

    @IsNotEmpty({ message: 'EMPTY_PARAM_PASSWORD' })
    @Length(8, 20, { message: 'INVALID_PARAM_PASSWORD' })
    public password: string;

    public auth: string;

    public phone: string;

    public accessableIp: string;

    public toEntiry(): UserModel {
        const user = new UserModel();
        user.id = this.id;
        user.password = this.password;
        user.name = this.name;
        user.phone = this.phone;
        user.accessableIp = this.accessableIp;
        user.auth = this.auth;

        return user;
    }
}

export class LoginUserDTO {
    @IsNotEmpty({ message: 'EMPTY_PARAM_ID' })
    @Length(5, 50, { message: 'INVALID_PARAM_ID' })
    public id: string;

    @IsNotEmpty({ message: 'EMPTY_PARAM_PASSWORD' })
    @Length(8, 20, { message: 'INVALID_PARAM_PASSWORD' })
    public password: string;
}

export class ResponseUserDTO {
    public id: string;
    public name: string;
    public auth: string;
    public phone: string;
    public accessableIp: string;
    public createAt: Date;
    public updateAt: Date;
    public token: string;
}

export class UpdateUserDTO {
    @IsNotEmpty({ message: 'EMPTY_PARAM_NAME' })
    @Length(3, 20, { message: 'INVALID_PARAM_NAME' })
    public name: string;

    public phone: string;

    public accessableIp: string;
}

export class UpdateUserPasswordDTO {
    @IsNotEmpty({ message: 'EMPTY_PARAM_PASSWORD' })
    @Length(8, 20, { message: 'INVALID_PARAM_PASSWORD' })
    public password: string;
}
