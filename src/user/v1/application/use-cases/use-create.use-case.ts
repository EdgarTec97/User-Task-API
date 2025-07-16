import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/user/v1/domain/user/user';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';

@Injectable()
export class UserCreateUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private repository: IUserRepository,
  ) {}
  async execute(user: User): Promise<void> {
    const existingUser = await this.repository.findByEmail(user.getEmail().valueOf());

    if (existingUser) throw new Error('User with this email already exists');

    return await this.repository.save(user.toPrimitives());
  }
}
