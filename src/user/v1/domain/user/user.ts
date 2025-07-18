import { AggregateRoot } from '@/shared/domain/ddd/AggregateRoot';
import { UserId } from '@/user/v1/domain/user/user.id';
import { UserName } from '@/user/v1/domain/user/user.name';
import { UserPassword } from '@/user/v1/domain/user/user.password';
import { UserEmail } from '@/user/v1/domain/user/user.email';
import { UserCreatedAt } from '@/user/v1/domain/user/user.createdAt';
import { UserUpdatedAt } from '@/user/v1/domain/user/user.updatedAt';
import { UserCreatedEvent } from '@/user/v1/domain/events/user-created.event';
import { Role } from '@/shared/domain/tokens/Role';

export type UserPrimitives = ReturnType<User['toPrimitives']>;

export class User extends AggregateRoot {
  constructor(
    private readonly id: UserId,
    private readonly name: UserName,
    private readonly email: UserEmail,
    private readonly password: UserPassword,
    private readonly role: Role,
    private readonly createdAt: UserCreatedAt,
    private readonly updatedAt: UserUpdatedAt,
  ) {
    super();
  }

  public static fromPrimitives(p: UserPrimitives): User {
    return new User(
      new UserId(p.id),
      new UserName(p.name),
      new UserEmail(p.email),
      new UserPassword(p.password),
      new Role(p.role),
      new UserCreatedAt(p.createdAt),
      new UserUpdatedAt(p.updatedAt),
    );
  }

  public buildEvents(): void {
    const userCreatedEvent = new UserCreatedEvent(
      this.id.valueOf(),
      this.getId(),
      this.getName(),
      this.getEmail(),
      this.getRole(),
      this.getCreatedAt(),
    );
    this.record(userCreatedEvent);
  }

  public getEmail(): UserEmail {
    return this.email;
  }

  public getId(): UserId {
    return this.id;
  }

  public getName(): UserName {
    return this.name;
  }

  public getPassword(): UserPassword {
    return this.password;
  }

  public getRole(): Role {
    return this.role;
  }

  public getCreatedAt(): UserCreatedAt {
    return this.createdAt;
  }

  public getUpdatedAt(): UserUpdatedAt {
    return this.updatedAt;
  }

  toPrimitives() {
    return {
      id: this.id.valueOf(),
      name: this.name.valueOf(),
      email: this.email.valueOf(),
      password: this.password.valueOf(),
      role: this.role.valueOf(),
      createdAt: this.createdAt.valueOf(),
      updatedAt: this.updatedAt.valueOf(),
    };
  }
}
