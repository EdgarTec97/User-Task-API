import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/user/v1/domain/user/user';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserPagination } from '@/user/v1/domain/pagination/user.pagination';
import { Paginated } from '@/shared/domain/utils/Paginated';

@Injectable()
export class UserFindUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private repository: IUserRepository,
  ) {}
  async execute(pagination: UserPagination): Promise<Paginated<User>> {
    const records: Paginated<User> = await this.repository.find(pagination.toPrimitives());

    return records;
  }
}
