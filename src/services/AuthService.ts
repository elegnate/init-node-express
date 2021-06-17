import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserModel } from '../models/UserModel';
import { UserRepository } from '../repositories/UserRepository';
import { LoginUserDTO } from '../dtos/UserDTO';
import { UnauthorizedError, BadRequestError } from 'routing-controllers';

@Service()
export class AuthService {
    constructor(@InjectRepository() private userRepository: UserRepository) {}

    /**
     * validate
     * @param loginUserDTO
     * @returns
     */
    public async login(loginUserDTO: LoginUserDTO): Promise<UserModel> {
        const user: UserModel = await this.userRepository.findOne({
            select: [
                'id',
                'name',
                'phone',
                'factory',
                'auth',
                'accessableIp',
                'password',
                'createAt',
                'updateAt',
                'password',
            ],
            where: { id: loginUserDTO.id },
        });
        if (!user) throw new BadRequestError('NOT_FOUND_ID');
        const isMatched: boolean = await user.comparePassword(loginUserDTO.password);
        if (!isMatched) throw new UnauthorizedError('INVALID_PASSWORD');
        return user;
    }
}
