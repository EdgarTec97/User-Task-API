import { AggregateRoot } from '@/shared/domain/ddd/AggregateRoot';
import { User } from '@/user/v1/domain/user/user';
import { UsertTaskCost } from '@/user/v1/domain/user-task/user.task.cost';
import { UsertTaskCompleted } from '@/user/v1/domain/user-task/user.task.completed';

export type UserTaskPrimitives = ReturnType<UserTask['toPrimitives']>;

export class UserTask extends AggregateRoot {
  constructor(
    private readonly user: User,
    private readonly completedTasksCount: UsertTaskCost,
    private readonly totalCompletedTasksCost: UsertTaskCompleted,
  ) {
    super();
  }

  public static fromPrimitives(p: UserTaskPrimitives): UserTask {
    return new UserTask(
      User.fromPrimitives(p.user),
      new UsertTaskCost(p.completedTasksCount),
      new UsertTaskCompleted(p.totalCompletedTasksCost),
    );
  }

  public getUser(): User {
    return this.user;
  }

  toPrimitives() {
    return {
      user: this.user.toPrimitives(),
      completedTasksCount: this.completedTasksCount.valueOf(),
      totalCompletedTasksCost: this.totalCompletedTasksCost.valueOf(),
    };
  }
}
