import { EntityRepository, Repository } from 'typeorm';
import { UserModel } from '../models/UserModel';

/**
 * User DAO Class
 */
@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {}
