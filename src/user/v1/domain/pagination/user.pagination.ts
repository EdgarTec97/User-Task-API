import { AggregateRoot } from '@/shared/domain/ddd/AggregateRoot';
import { UserPaginationName } from '@/user/v1/domain/pagination/user.pagination.name';
import { UserPaginationEmail } from '@/user/v1/domain/pagination/user.pagination.email';
import { UserPaginationPage } from '@/user/v1/domain/pagination/user.pagination.page';
import { UserPaginationPageSize } from '@/user/v1/domain/pagination/user.pagination.pageSize';
import { Role } from '@/shared/domain/tokens/Role';

export type UserPaginationPrimitives = ReturnType<UserPagination['toPrimitives']>;

export class UserPagination extends AggregateRoot {
  constructor(
    private readonly page: UserPaginationPage,
    private readonly pageSize: UserPaginationPageSize,
    private readonly name: UserPaginationName,
    private readonly email: UserPaginationEmail,
    private readonly role?: Role,
  ) {
    super();
  }

  public static fromPrimitives(p: UserPaginationPrimitives): UserPagination {
    return new UserPagination(
      new UserPaginationPage(p.page),
      new UserPaginationPageSize(p.pageSize),
      new UserPaginationName(p.name),
      new UserPaginationEmail(p.email),
      p.role && new Role(p.role),
    );
  }

  public getPage(): UserPaginationPage {
    return this.page;
  }

  public getPageSize(): UserPaginationPageSize {
    return this.pageSize;
  }

  public getName(): UserPaginationName {
    return this.name;
  }

  public getEmail(): UserPaginationEmail {
    return this.email;
  }

  public getRole(): Role | undefined {
    return this.role;
  }

  toPrimitives() {
    return {
      page: this.page.valueOf(),
      pageSize: this.pageSize.valueOf(),
      name: this.name.valueOf(),
      email: this.email.valueOf(),
      role: this.role?.valueOf(),
    };
  }
}
