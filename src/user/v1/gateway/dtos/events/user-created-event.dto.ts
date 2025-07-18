import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { UserCreatedEvent } from '@/user/v1/domain/events/user-created.event';
import { Role } from '@/shared/domain/jwt/Role';

export class UserCreatedEventDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  userName!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  userEmail!: string;

  @ApiProperty({ enum: Role, example: Role.MEMBER })
  @IsEnum(Role)
  userRole!: Role;

  @ApiProperty({ example: '2023-12-01T10:00:00.000Z' })
  @IsDateString()
  userCreatedAt!: string;

  @ApiProperty({ example: '2023-12-01T10:00:00.000Z' })
  @IsDateString()
  occurredOn!: string;

  @ApiProperty({ example: 'user.created' })
  @IsString()
  eventName!: string;

  static fromDomain(event: UserCreatedEvent): UserCreatedEventDto {
    const primitives = event.toPrimitives();

    return primitives as UserCreatedEventDto;
  }

  toDomain(): UserCreatedEvent {
    return UserCreatedEvent.fromPrimitives(this);
  }
}
