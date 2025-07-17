import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User as UserEntity } from '@/user/v1/infrastructure/entities/user.entity';
import { Task } from '@/task/v1/infrastructure/entities/task.entity';
import { UserPrimitives, User as DomainUser } from '@/user/v1/domain/user/user';
import { IUserRepository } from '@/user/v1/domain/ports/user.repository';
import { UserTask } from '@/user/v1/domain/user-task/user.task';
import { UserPaginationPrimitives } from '@/user/v1/domain/pagination/user.pagination';
import { Paginated } from '@/shared/domain/utils/Paginated';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly ormRepo: Repository<UserEntity>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
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

    const users: DomainUser[] = items.map((user: UserEntity) => this.toDomainUser(user));

    return new Paginated<DomainUser>(users, page, pageSize, total);
  }

  async findWithTaskStats(params: UserPaginationPrimitives): Promise<Paginated<UserTask>> {
    const { email, name, page, pageSize, role } = params;

    const queryBuilder = this.ormRepo
      .createQueryBuilder('user')
      .leftJoin('user.tasks', 'task')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.password',
        'user.role',
        'user.createdAt',
        'user.updatedAt',
        "COUNT(CASE WHEN task.status = 'completed' THEN 1 END) as completedTasksCount",
        "COALESCE(SUM(CASE WHEN task.status = 'completed' THEN task.cost ELSE 0 END), 0) as totalCompletedTasksCost",
      ])
      .groupBy('user.id');

    if (email) {
      queryBuilder.andWhere('user.email = :email', { email });
    }
    if (name) {
      queryBuilder.andWhere('user.name ILIKE :name', { name: `${name}%` });
    }
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    const rawResults = await queryBuilder.getRawMany();

    const countQuery = this.ormRepo.createQueryBuilder('user');
    if (email) {
      countQuery.andWhere('user.email = :email', { email });
    }
    if (name) {
      countQuery.andWhere('user.name ILIKE :name', { name: `${name}%` });
    }
    if (role) {
      countQuery.andWhere('user.role = :role', { role });
    }

    const total = await countQuery.getCount();

    const usersWithStats: UserTask[] = rawResults.map((raw) =>
      UserTask.fromPrimitives({
        user: raw,
        completedTasksCount: Number(raw.completedTasksCount) || 0,
        totalCompletedTasksCost: Number(raw.totalCompletedTasksCost) || 0,
      }),
    );

    return new Paginated<UserTask>(usersWithStats, page, pageSize, total);
  }

  async findById(id: string): Promise<DomainUser | void> {
    const user: UserEntity | null = await this.ormRepo.findOne({ where: { id } });

    if (user) return this.toDomainUser(user);
  }

  async findByEmail(email: string): Promise<DomainUser | void> {
    const user: UserEntity | null = await this.ormRepo.findOne({ where: { email } });
    if (user) return this.toDomainUser(user);
  }

  async updateById(id: string, params: Partial<UserPrimitives>): Promise<void> {
    await this.ormRepo.update(id, params);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  private toDomainUser(user: UserEntity): DomainUser {
    return DomainUser.fromPrimitives({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  }
}
