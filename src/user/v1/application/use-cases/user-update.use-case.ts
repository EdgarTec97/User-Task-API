import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/user/v1/domain/user/user';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserId } from '@/user/v1/domain/user/user.id';
import { UserName } from '@/user/v1/domain/user/user.name';
import { Role } from '@/shared/domain/tokens/Role';

@Injectable()
export class UserUpdateUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private repository: IUserRepository,
  ) {}
  async execute(userId: UserId, name?: UserName, role?: Role): Promise<void> {
    const id: string = userId.valueOf();
    const user: User | void = await this.repository.findById(id);

    if (!user) throw new NotFoundException('User does not exist.');

    return await this.repository.updateById(id, { name: name?.valueOf(), role: role?.valueOf() });
  }
}
