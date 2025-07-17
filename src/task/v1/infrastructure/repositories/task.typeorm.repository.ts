import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { Task as DomainTask, TaskPrimitives } from '@/task/v1/domain/task/task';
import { TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { Task as TaskEntity } from '@/task/v1/infrastructure/entities/task.entity';
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';
import { TaskPaginationPrimitives } from '@/task/v1/domain/pagination/task.pagination';
import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';
import { TaskAnalytics } from '@/task/v1/domain/analytics/task-analytics';
import { TaskAnalyticsStartDate } from '@/task/v1/domain/analytics/task-analytics.start-date';
import { TaskAnalyticsEndDate } from '@/task/v1/domain/analytics/task-analytics.end-date';
import { TaskAnalyticsGranularity } from '@/task/v1/domain/analytics/task-analytics.granularity';

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
    const { page = 1, pageSize = 10 } = pagination;

    const queryBuilder = this.repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUsers', 'user')
      .orderBy('task.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (pagination.title) queryBuilder.andWhere('task.title ILIKE :title', { title: `%${pagination.title}%` });

    if (pagination.startDate && pagination.endDate)
      queryBuilder.andWhere('task.dueDate BETWEEN :start AND :end', {
        start: GeneralUtils.startDay(pagination.startDate),
        end: GeneralUtils.endDay(pagination.endDate),
      });
    else if (pagination.startDate)
      queryBuilder.andWhere('task.dueDate >= :start', {
        start: GeneralUtils.startDay(pagination.startDate),
      });
    else if (pagination.endDate)
      queryBuilder.andWhere('task.dueDate <= :end', {
        end: GeneralUtils.endDay(pagination.endDate),
      });

    if (pagination.assignedUser) queryBuilder.andWhere('user.id = :userId', { userId: pagination.assignedUser });

    if (pagination.assignedUserEmail)
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${pagination.assignedUserEmail}%`,
      });

    if (pagination.status)
      queryBuilder.andWhere('task.status = :status', {
        status: pagination.status,
      });

    if (pagination.assignedUserName)
      queryBuilder.andWhere('user.name ILIKE :userName', {
        userName: `%${pagination.assignedUserName}%`,
      });

    const [taskEntities, total] = await queryBuilder.getManyAndCount();

    const elements: DomainTask[] = taskEntities.map((taskEntity) => this.toDomainTask(taskEntity));

    return new Paginated(elements, pagination.page, pagination.pageSize, total);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async buildAnalytics(
    startDate?: TaskAnalyticsStartDate,
    endDate?: TaskAnalyticsEndDate,
    granularity?: TaskAnalyticsGranularity,
  ): Promise<TaskAnalytics> {
    const queryBuilder = this.repository.createQueryBuilder('task');

    if (startDate && endDate)
      queryBuilder.andWhere('task.createdAt BETWEEN :start AND :end', {
        start: GeneralUtils.startDay(startDate.valueOf()),
        end: GeneralUtils.endDay(endDate.valueOf()),
      });
    else if (startDate)
      queryBuilder.andWhere('task.createdAt >= :start', {
        start: GeneralUtils.startDay(startDate.valueOf()),
      });
    else if (endDate)
      queryBuilder.andWhere('task.createdAt <= :end', {
        end: GeneralUtils.endDay(endDate.valueOf()),
      });

    const totalTasks: number = await queryBuilder.getCount();

    const completedTasksQuery = queryBuilder.clone();
    const completedTasks: number = await completedTasksQuery
      .andWhere('task.status = :status', { status: TaskStatusEnum.COMPLETED })
      .getCount();

    const activeTasksQuery = queryBuilder.clone();
    const activeTasks: number = await activeTasksQuery
      .andWhere('task.status = :status', { status: TaskStatusEnum.ACTIVE })
      .getCount();

    const avgEstimationResult: { average: string } | undefined = await queryBuilder
      .clone()
      .select('AVG(task.estimationHours)', 'average')
      .getRawOne();

    const averageEstimationHours = Number(avgEstimationResult?.average) || 0;

    const totalCostResult: { total: string } | undefined = await queryBuilder
      .clone()
      .select('SUM(task.cost)', 'total')
      .andWhere('task.status = :status', { status: TaskStatusEnum.COMPLETED })
      .getRawOne();

    const totalCostOfCompletedTasks: number = Number(totalCostResult?.total) || 0;

    // New statistic 1: Total estimation hours for completed tasks
    const totalEstimationHoursResult: { total: string } | undefined = await queryBuilder
      .clone()
      .select('SUM(task.estimationHours)', 'total')
      .andWhere('task.status = :status', { status: TaskStatusEnum.COMPLETED })
      .getRawOne();

    const totalEstimationHoursCompleted: number = Number(totalEstimationHoursResult?.total) || 0;

    // New statistic 2: Average cost per completed task
    const averageCostPerCompletedTask: number = completedTasks > 0 ? totalCostOfCompletedTasks / completedTasks : 0;

    return TaskAnalytics.fromPrimitives({
      totalTasks,
      completedTasks,
      activeTasks,
      averageEstimationHours,
      totalCostCompletedTasks: totalCostOfCompletedTasks,
      totalEstimationHoursCompleted,
      averageCostPerCompletedTask,
      startDate: startDate?.valueOf(),
      endDate: endDate?.valueOf(),
      granularity: granularity?.valueOf(),
    });
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
