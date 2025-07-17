import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThanOrEqual } from 'typeorm';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { Task as DomainTask, TaskPrimitives } from '@/task/v1/domain/task/task';
import { TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { Task as TaskEntity } from '@/task/v1/infrastructure/entities/task.entity';
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';
import { TaskPaginationPrimitives } from '@/task/v1/domain/pagination/task.pagination';
import { User } from '@/user/v1/infrastructure/entities/user.entity';

@Injectable()
export class TaskTypeOrmRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(task: TaskPrimitives): Promise<void> {
    const assignedUsersEntities = await this.userRepository.findBy({
      id: In(task.assignedUsers),
    });

    const taskEntity: TaskEntity = this.repository.create({ ...task, assignedUsers: assignedUsersEntities });
    await this.repository.save(taskEntity);
  }

  async findById(id: string): Promise<DomainTask | void> {
    const taskEntity: TaskEntity | null = await this.repository.findOne({
      where: { id },
      relations: ['assignedUsers'],
    });

    if (taskEntity) return this.toDomainTask(taskEntity);
  }

  async findAll(pagination: TaskPaginationPrimitives): Promise<Paginated<DomainTask>> {
    const queryBuilder = this.repository.createQueryBuilder('task');

    if (pagination.title) {
      queryBuilder.andWhere('task.title ILIKE :title', { title: `%${pagination.title}%` });
    }
    if (pagination.dueDate) {
      queryBuilder.andWhere('task.dueDate = :dueDate', { dueDate: pagination.dueDate });
    }
    if (pagination.assignedUser) {
      queryBuilder
        .leftJoinAndSelect('task.assignedUsers', 'user')
        .andWhere('user.id = :userId', { userId: pagination.assignedUser });
    }
    if (pagination.assignedUserEmail) {
      queryBuilder
        .leftJoinAndSelect('task.assignedUsers', 'user')
        .andWhere('user.email ILIKE :email', { email: `%${pagination.assignedUserEmail}%` });
    }
    if (pagination.assignedUserName) {
      queryBuilder
        .leftJoinAndSelect('task.assignedUsers', 'user')
        .andWhere('user.name ILIKE :userName', { userName: `%${pagination.assignedUserName}%` });
    }

    queryBuilder.orderBy('task.createdAt', 'DESC');
    queryBuilder.skip(pagination.page * pagination.pageSize);
    queryBuilder.take(pagination.pageSize);

    const [taskEntities, total] = await queryBuilder.getManyAndCount();

    const elements: DomainTask[] = taskEntities.map((taskEntity) => this.toDomainTask(taskEntity));

    return new Paginated(elements, pagination.page, pagination.pageSize, total);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async buildAnalytics(): Promise<any> {
    const totalTasks: number = await this.repository.count();

    const completedTasks: number = await this.repository.count({
      where: { status: TaskStatusEnum.COMPLETED },
    });

    const activeTasks: number = await this.repository.count({
      where: { status: TaskStatusEnum.ACTIVE },
    });

    const avgEstimationResult: { average: string } | undefined = await this.repository
      .createQueryBuilder('task')
      .select('AVG(task.estimationHours)', 'average')
      .getRawOne();

    const averageEstimationHours = Number(avgEstimationResult?.average) || 0;

    const totalCostResult: { total: string } | undefined = await this.repository
      .createQueryBuilder('task')
      .select('SUM(task.cost)', 'total')
      .where('task.status = :status', { status: 'completed' })
      .getRawOne();

    const totalCostOfCompletedTasks: number = Number(totalCostResult?.total) || 0;

    const currentMonth: Date = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const tasksCompletedThisMonth = await this.repository.count({
      where: {
        status: TaskStatusEnum.COMPLETED,
        updatedAt: MoreThanOrEqual(currentMonth),
      },
    });

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      averageEstimationHours,
      totalCostOfCompletedTasks,
      tasksCompletedThisMonth,
    };
  }

  private toDomainTask(task: TaskEntity): DomainTask {
    return DomainTask.fromPrimitives({
      ...task,
      users: task.assignedUsers.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
      assignedUsers: task.assignedUsers.map((user) => user.id),
      dueDate: task.dueDate.toISOString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    });
  }
}
