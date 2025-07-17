import { Inject, Injectable } from '@nestjs/common';
import { UserTask } from '@/user/v1/domain/user-task/user.task';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserPagination } from '@/user/v1/domain/pagination/user.pagination';
import { Paginated } from '@/shared/domain/utils/Paginated';

@Injectable()
export class UserTaskFindUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private repository: IUserRepository,
  ) {}
  async execute(pagination: UserPagination): Promise<Paginated<UserTask>> {
    const records: Paginated<UserTask> = await this.repository.findWithTaskStats(pagination.toPrimitives());

    return records;
  }
}
