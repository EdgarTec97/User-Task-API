import { AggregateRoot } from '@/shared/domain/ddd/AggregateRoot';
import { TaskPaginationAssignedUser } from '@/task/v1/domain/pagination/task.pagination.assignedUser';
import { TaskPaginationAssignedUserEmail } from '@/task/v1/domain/pagination/task.pagination.assignedUserEmail';
import { TaskPaginationAssignedUserName } from '@/task/v1/domain/pagination/task.pagination.assignedUserName';
import { TaskPaginationDueDate } from '@/task/v1/domain/pagination/task.pagination.dueDate';
import { TaskPaginationPage } from '@/task/v1/domain/pagination/task.pagination.page';
import { TaskPaginationPageSize } from '@/task/v1/domain/pagination/task.pagination.pageSize';
import { TaskPaginationTitle } from '@/task/v1/domain/pagination/task.pagination.title';

export type TaskPaginationPrimitives = ReturnType<TaskPagination['toPrimitives']>;

export class TaskPagination extends AggregateRoot {
  constructor(
    private readonly page: TaskPaginationPage,
    private readonly pageSize: TaskPaginationPageSize,
    private readonly title: TaskPaginationTitle,
    private readonly dueDate: TaskPaginationDueDate,
    private readonly assignedUser: TaskPaginationAssignedUser,
    private readonly assignedUserName: TaskPaginationAssignedUserName,
    private readonly assignedUserEmail: TaskPaginationAssignedUserEmail,
  ) {
    super();
  }

  public static fromPrimitives(p: TaskPaginationPrimitives): TaskPagination {
    return new TaskPagination(
      new TaskPaginationPage(p.page),
      new TaskPaginationPageSize(p.pageSize),
      new TaskPaginationTitle(p.title),
      new TaskPaginationDueDate(p.dueDate),
      new TaskPaginationAssignedUser(p.assignedUser),
      new TaskPaginationAssignedUserName(p.assignedUserName),
      new TaskPaginationAssignedUserEmail(p.assignedUserEmail),
    );
  }

  toPrimitives() {
    return {
      page: this.page.valueOf(),
      pageSize: this.pageSize.valueOf(),
      title: this.title.valueOf(),
      dueDate: this.dueDate.valueOf(),
      assignedUser: this.assignedUser.valueOf(),
      assignedUserName: this.assignedUserName.valueOf(),
      assignedUserEmail: this.assignedUserEmail.valueOf(),
    };
  }
}
