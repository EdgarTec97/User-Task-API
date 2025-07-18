import { AggregateRoot } from '@/shared/domain/ddd/AggregateRoot';
import { TaskId } from '@/task/v1/domain/task/task.id';
import { TaskTitle } from '@/task/v1/domain/task/task.title';
import { TaskDescription } from '@/task/v1/domain/task/task.description';
import { TaskEstimationHours } from '@/task/v1/domain/task/task.estimation-hours';
import { TaskDueDate } from '@/task/v1/domain/task/task.due-date';
import { TaskStatus } from '@/task/v1/domain/task/task.status';
import { TaskAssignedUsers } from '@/task/v1/domain/task/task.assigned-users';
import { TaskCost } from '@/task/v1/domain/task/task.cost';
import { TaskCreatedAt } from '@/task/v1/domain/task/task.createdAt';
import { TaskUpdatedAt } from '@/task/v1/domain/task/task.updatedAt';
import { User } from '@/user/v1/domain/user/user';

export type TaskPrimitives = ReturnType<Task['toPrimitives']>;

export class Task extends AggregateRoot {
  constructor(
    private readonly id: TaskId,
    private readonly title: TaskTitle,
    private readonly description: TaskDescription,
    private readonly estimationHours: TaskEstimationHours,
    private readonly dueDate: TaskDueDate,
    private readonly status: TaskStatus,
    private readonly assignedUsers: TaskAssignedUsers[],
    private readonly cost: TaskCost,
    private readonly users: User[],
    private readonly createdAt: TaskCreatedAt,
    private readonly updatedAt: TaskUpdatedAt,
  ) {
    super();
  }

  public static fromPrimitives(p: TaskPrimitives): Task {
    return new Task(
      new TaskId(p.id),
      new TaskTitle(p.title),
      new TaskDescription(p.description),
      new TaskEstimationHours(p.estimationHours),
      new TaskDueDate(p.dueDate),
      new TaskStatus(p.status),
      p.assignedUsers?.map((user) => new TaskAssignedUsers(user)),
      new TaskCost(p.cost),
      p.users.map((user) => User.fromPrimitives(user)),
      new TaskCreatedAt(p.createdAt),
      new TaskUpdatedAt(p.updatedAt),
    );
  }

  public getId(): TaskId {
    return this.id;
  }

  toPrimitives() {
    return {
      id: this.id.valueOf(),
      title: this.title.valueOf(),
      description: this.description.valueOf(),
      estimationHours: this.estimationHours.valueOf(),
      dueDate: this.dueDate.valueOf(),
      status: this.status.valueOf(),
      assignedUsers: this.assignedUsers?.map((user) => user.valueOf()),
      cost: this.cost.valueOf(),
      users: this.users.map((user) => user.toPrimitives()),
      createdAt: this.createdAt.valueOf(),
      updatedAt: this.updatedAt.valueOf(),
    };
  }
}
