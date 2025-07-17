import { UserPrimitives, User } from '@/user/v1/domain/user/user';
import { UserPaginationPrimitives } from '@/user/v1/domain/pagination/user.pagination';
import { Paginated } from '@/shared/domain/utils/Paginated';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  find(params: UserPaginationPrimitives): Promise<Paginated<User>>;
  save(user: UserPrimitives): Promise<void>;
  findById(id: string): Promise<User | void>;
  findByEmail(email: string): Promise<User | void>;
  delete(id: string): Promise<void>;
}
