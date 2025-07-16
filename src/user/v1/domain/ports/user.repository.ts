import { UserPrimitives, User } from '@/user/v1/domain/user/user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  save(user: UserPrimitives): Promise<void>;
  findById(id: string): Promise<User | void>;
  findByEmail(email: string): Promise<User | void>;
  delete(id: string): Promise<void>;
}
