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
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';

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
    const { email, name, role, page, pageSize } = params;

    const completedStatus = TaskStatusEnum.COMPLETED;

    const qb = this.ormRepo
      .createQueryBuilder('user')
      .leftJoin('user.tasks', 'task')
      .select([
        'user.id          AS id',
        'user.name        AS name',
        'user.email       AS email',
        'user.role        AS role',
        'user.createdAt   AS createdAt',
        'user.updatedAt   AS updatedAt',
        `COUNT(CASE WHEN task.status = :completed THEN 1 END)            AS completedTasksCount`,
        `COALESCE(SUM(CASE WHEN task.status = :completed THEN task.cost ELSE 0 END),0) AS totalCompletedTasksCost`,
      ])
      .setParameter('completed', completedStatus)
      .groupBy('user.id, user.name, user.email, user.role, user.createdAt, user.updatedAt')
      .orderBy('user.createdAt', 'DESC')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    if (email) qb.andWhere('user.email = :email', { email });
    if (name) qb.andWhere('user.name  ILIKE :name', { name: `${name}%` });
    if (role) qb.andWhere('user.role  = :role', { role });

    const raw = await qb.getRawMany();

    const countQb = this.ormRepo.createQueryBuilder('user');
    if (email) countQb.andWhere('user.email = :email', { email });
    if (name) countQb.andWhere('user.name  ILIKE :name', { name: `${name}%` });
    if (role) countQb.andWhere('user.role  = :role', { role });

    const total = await countQb.getCount();

    const result = raw.map((r) =>
      UserTask.fromPrimitives({
        user: r,
        completedTasksCount: Number(r.completedtaskscount),
        totalCompletedTasksCost: Number(r.totalcompletedtaskscost),
      }),
    );

    return new Paginated(result, page, pageSize, total);
  }

  async findById(id: string): Promise<DomainUser | void> {
    const user: UserEntity | null = await this.ormRepo.findOne({ where: { id } });

    if (user) return this.toDomainUser(user);
  }

  async findByEmail(email: string): Promise<DomainUser | void> {
    const user: UserEntity | null = await this.ormRepo.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role', 'createdAt', 'updatedAt'],
    });
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
