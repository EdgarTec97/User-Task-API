import { AggregateRoot } from '@/shared/domain/ddd/AggregateRoot';
import { TaskPaginationAssignedUser } from '@/task/v1/domain/pagination/task.pagination.assignedUser';
import { TaskPaginationAssignedUserEmail } from '@/task/v1/domain/pagination/task.pagination.assignedUserEmail';
import { TaskPaginationAssignedUserName } from '@/task/v1/domain/pagination/task.pagination.assignedUserName';
import { TaskPaginationDueDate } from '@/task/v1/domain/pagination/task.pagination.dueDate';
import { TaskPaginationPage } from '@/task/v1/domain/pagination/task.pagination.page';
import { TaskPaginationPageSize } from '@/task/v1/domain/pagination/task.pagination.pageSize';
import { TaskPaginationTitle } from '@/task/v1/domain/pagination/task.pagination.title';
import { TaskPaginationStatus } from '@/task/v1/domain/pagination/task.pagination.status';

export type TaskPaginationPrimitives = ReturnType<TaskPagination['toPrimitives']>;

export class TaskPagination extends AggregateRoot {
  constructor(
    private readonly page: TaskPaginationPage,
    private readonly pageSize: TaskPaginationPageSize,
    private readonly title: TaskPaginationTitle,
    private readonly startDate: TaskPaginationDueDate,
    private readonly endDate: TaskPaginationDueDate,
    private readonly assignedUser: TaskPaginationAssignedUser,
    private readonly assignedUserName: TaskPaginationAssignedUserName,
    private readonly assignedUserEmail: TaskPaginationAssignedUserEmail,
    private readonly status: TaskPaginationStatus,
  ) {
    super();
  }

  public static fromPrimitives(p: TaskPaginationPrimitives): TaskPagination {
    return new TaskPagination(
      new TaskPaginationPage(p.page),
      new TaskPaginationPageSize(p.pageSize),
      new TaskPaginationTitle(p.title),
      new TaskPaginationDueDate(p.startDate),
      new TaskPaginationDueDate(p.endDate),
      new TaskPaginationAssignedUser(p.assignedUser),
      new TaskPaginationAssignedUserName(p.assignedUserName),
      new TaskPaginationAssignedUserEmail(p.assignedUserEmail),
      new TaskPaginationStatus(p.status),
    );
  }

  toPrimitives() {
    return {
      page: this.page.valueOf(),
      pageSize: this.pageSize.valueOf(),
      title: this.title.valueOf(),
      startDate: this.startDate.valueOf(),
      endDate: this.endDate.valueOf(),
      assignedUser: this.assignedUser.valueOf(),
      assignedUserName: this.assignedUserName.valueOf(),
      assignedUserEmail: this.assignedUserEmail.valueOf(),
      status: this.status.valueOf(),
    };
  }
}
