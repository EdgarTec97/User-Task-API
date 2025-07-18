import { UserCreatedEventDto } from '@/user/v1/gateway/dtos/events/user-created-event.dto';
import { validate } from 'class-validator';
import { UserCreatedEvent } from '@/user/v1/domain/events/user-created.event';
import { Role } from '@/shared/domain/jwt/Role';

describe('UserCreatedEventDto', () => {
  it('should be defined', () => {
    expect(new UserCreatedEventDto()).toBeDefined();
  });

  it('should validate a valid UserCreatedEventDto', async () => {
    const dto = new UserCreatedEventDto();
    dto.id = '550e8400-e29b-41d4-a716-446655440000';
    dto.userId = '550e8400-e29b-41d4-a716-446655440001';
    dto.userName = 'John Doe';
    dto.userEmail = 'john.doe@example.com';
    dto.userRole = Role.MEMBER;
    dto.userCreatedAt = '2023-12-01T10:00:00.000Z';
    dto.occurredOn = '2023-12-01T10:00:00.000Z';
    dto.eventName = 'user.created';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate with a missing id', async () => {
    const dto = new UserCreatedEventDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440001';
    dto.userName = 'John Doe';
    dto.userEmail = 'john.doe@example.com';
    dto.userRole = Role.MEMBER;
    dto.userCreatedAt = '2023-12-01T10:00:00.000Z';
    dto.occurredOn = '2023-12-01T10:00:00.000Z';
    dto.eventName = 'user.created';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('id');
  });

  it('should not validate with an invalid email', async () => {
    const dto = new UserCreatedEventDto();
    dto.id = '550e8400-e29b-41d4-a716-446655440000';
    dto.userId = '550e8400-e29b-41d4-a716-446655440001';
    dto.userName = 'John Doe';
    dto.userEmail = 'invalid-email';
    dto.userRole = Role.MEMBER;
    dto.userCreatedAt = '2023-12-01T10:00:00.000Z';
    dto.occurredOn = '2023-12-01T10:00:00.000Z';
    dto.eventName = 'user.created';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('userEmail');
  });

  it('should create a UserCreatedEventDto from a UserCreatedEvent domain object', () => {
    const mockEvent = UserCreatedEvent.fromPrimitives({
      id: 'event-id-123',
      userId: 'user-id-456',
      userName: 'Event User',
      userEmail: 'event@example.com',
      userRole: Role.ADMIN,
      userCreatedAt: '2024-01-01T00:00:00.000Z',
      occurredOn: '2024-01-01T00:00:00.000Z',
      eventName: 'user.created',
    });

    const dto = UserCreatedEventDto.fromDomain(mockEvent);

    expect(dto.id).toEqual('event-id-123');
    expect(dto.userId).toEqual('user-id-456');
    expect(dto.userName).toEqual('Event User');
    expect(dto.userEmail).toEqual('event@example.com');
    expect(dto.userRole).toEqual(Role.ADMIN);
    expect(dto.userCreatedAt).toEqual('2024-01-01T00:00:00.000Z');
    expect(dto.occurredOn).toEqual('2024-01-01T00:00:00.000Z');
    expect(dto.eventName).toEqual('user.created');
  });

  it('should convert a UserCreatedEventDto to a UserCreatedEvent domain object', () => {
    const dto = new UserCreatedEventDto();
    dto.id = 'dto-event-id';
    dto.userId = 'dto-user-id';
    dto.userName = 'DTO User';
    dto.userEmail = 'dto@example.com';
    dto.userRole = Role.MEMBER;
    dto.userCreatedAt = '2024-02-01T00:00:00.000Z';
    dto.occurredOn = '2024-02-01T00:00:00.000Z';
    dto.eventName = 'user.created';

    const domainObject = dto.toDomain();

    expect(domainObject.getId().valueOf()).toEqual('dto-event-id');
    expect(domainObject.getUserId().valueOf()).toEqual('dto-user-id');
    expect(domainObject.getUserName().valueOf()).toEqual('DTO User');
    expect(domainObject.getUserEmail().valueOf()).toEqual('dto@example.com');
    expect(domainObject.getUserRole().valueOf()).toEqual(Role.MEMBER);
    expect(domainObject.getCreatedAt().valueOf()).toEqual('2024-02-01T00:00:00.000Z');
    expect(domainObject.getOccurredOn().valueOf()).toEqual(1706745600000);
    expect(domainObject.getEventName().valueOf()).toEqual('user.created');
  });
});
