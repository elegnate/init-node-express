import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserModel } from '../models/UserModel';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from '../dtos/UserDTO';

@Service()
export class UserService {
    constructor(@InjectRepository() private userRepository: UserRepository) {}

    /**
     * Create User
     * @param createUserDTO
     * @returns
     */
    public async createUser(createUserDTO: CreateUserDTO): Promise<UserModel> {
        const user = createUserDTO.toEntiry();
        return await this.userRepository.save(user);
    }

    /**
     * Get All Users
     * @returns
     */
    public async getUsers(): Promise<UserModel[]> {
        return await this.userRepository.find({
            select: ['id', 'name'],
        });
    }

    /**
     * Get User By ID
     * @param id
     * @returns
     */
    public async getUserById(id: string): Promise<UserModel> {
        return await this.userRepository.findOne({
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
            ],
            where: { id: id },
        });
    }

    /**
     * Update User Information
     * @param id
     * @param targetId
     * @param updateUserDTO
     * @returns
     */
    public async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<UserModel> {
        const user = await this.userRepository.findOne({
            where: { id: id },
        });
        if (!user) return null;
        user.name = updateUserDTO.name;
        user.phone = updateUserDTO.phone;
        user.accessableIp = updateUserDTO.accessableIp;
        return await this.userRepository.save(user);
    }

    /**
     * Update User Password
     * @param id
     * @param targetId
     * @param updateUserPasswordDTO
     * @returns
     */
    public async updateUserPassword(
        id: string,
        updateUserPasswordDTO: UpdateUserPasswordDTO,
    ): Promise<UserModel> {
        const user = await this.userRepository.findOne({
            where: { id: id },
        });

        if (user?.id !== id) return null;

        user.password = updateUserPasswordDTO.password;
        return await this.userRepository.save(user);
    }

    public async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete({
            id: id,
        });
    }

    /**
     * Check Existed User By ID
     * @param id
     * @returns
     */
    public async checkExistUser(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { id: id },
        });
        return user ? true : false;
    }
}
