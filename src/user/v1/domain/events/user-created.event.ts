import { DomainEvent } from '@/shared/domain/events/DomainEvent';
import { UserId } from '@/user/v1/domain/user/user.id';
import { UserName } from '@/user/v1/domain/user/user.name';
import { UserEmail } from '@/user/v1/domain/user/user.email';
import { Role } from '@/shared/domain/tokens/Role';
import { UserCreatedAt } from '@/user/v1/domain/user/user.createdAt';

export type UserCreatedEventPrimitives = ReturnType<UserCreatedEvent['toPrimitives']>;

export class UserCreatedEvent extends DomainEvent {
  public static readonly EVENT_NAME = 'user.created';

  constructor(
    eventId: string,
    private readonly userId: UserId,
    private readonly userName: UserName,
    private readonly userEmail: UserEmail,
    private readonly userRole: Role,
    private readonly createdAt: UserCreatedAt,
    private readonly occurredOn: Date = new Date(),
  ) {
    super(eventId);
  }

  public static fromPrimitives(primitives: UserCreatedEventPrimitives): UserCreatedEvent {
    return new UserCreatedEvent(
      primitives.id,
      new UserId(primitives.userId),
      new UserName(primitives.userName),
      new UserEmail(primitives.userEmail),
      new Role(primitives.userRole),
      new UserCreatedAt(primitives.userCreatedAt),
      new Date(primitives.occurredOn),
    );
  }

  public getUserId(): UserId {
    return this.userId;
  }

  public getUserName(): UserName {
    return this.userName;
  }

  public getUserEmail(): UserEmail {
    return this.userEmail;
  }

  public getUserRole(): Role {
    return this.userRole;
  }

  public getCreatedAt(): UserCreatedAt {
    return this.createdAt;
  }

  public getOccurredOn(): Date {
    return this.occurredOn;
  }

  public getEventName(): string {
    return UserCreatedEvent.EVENT_NAME;
  }

  public toPrimitives() {
    return {
      ...super.toPrimitives(),
      userId: this.userId.valueOf(),
      userName: this.userName.valueOf(),
      userEmail: this.userEmail.valueOf(),
      userRole: this.userRole.valueOf(),
      userCreatedAt: this.createdAt.valueOf(),
      occurredOn: this.occurredOn.toISOString(),
      eventName: this.getEventName(),
    };
  }
}
