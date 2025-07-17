import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/user/v1/domain/user/user';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserId } from '@/user/v1/domain/user/user.id';

@Injectable()
export class UserFindOneUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private repository: IUserRepository,
  ) {}
  async execute(userId: UserId): Promise<User> {
    const user: User | void = await this.repository.findById(userId.valueOf());

    if (!user) throw new NotFoundException('User does not exist.');

    return user;
  }
}
