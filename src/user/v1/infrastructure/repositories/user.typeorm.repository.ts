import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { UserPrimitives, User as DomainUser } from '@/user/v1/domain/user/user';
import { IUserRepository } from '@/user/v1/domain/ports/user.repository';
import { UserPaginationPrimitives } from '@/user/v1/domain/pagination/user.pagination';
import { Paginated } from '@/shared/domain/utils/Paginated';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepo: Repository<User>,
  ) {}

  async save(user: UserPrimitives): Promise<void> {
    await this.ormRepo.save(user);
  }

  async find(params: UserPaginationPrimitives): Promise<Paginated<DomainUser>> {
    const { email, name, page, pageSize, role } = params;
    const [items, total] = await this.ormRepo.findAndCount({
      where: {
        ...(email && { email }),
        ...(name && { name: ILike(`${name}%`) }),
        ...(role && { role }),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const users: DomainUser[] = items.map((user: User) => this.toDomainUser(user));

    return new Paginated<DomainUser>(users, page, pageSize, total);
  }

  async findById(id: string): Promise<DomainUser | void> {
    const user: User | null = await this.ormRepo.findOne({ where: { id } });

    if (user) return this.toDomainUser(user);
  }

  async findByEmail(email: string): Promise<DomainUser | void> {
    const user: User | null = await this.ormRepo.findOne({ where: { email } });
    if (user) return this.toDomainUser(user);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  private toDomainUser(user: User): DomainUser {
    return DomainUser.fromPrimitives({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  }
}
