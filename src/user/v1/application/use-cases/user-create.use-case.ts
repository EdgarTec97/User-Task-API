import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User, UserPrimitives } from '@/user/v1/domain/user/user';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { ENCRYPTION_SERVICE, IEncryptionService } from '@/shared/domain/encryption/encryption.service';
import type { UserCreatedKafkaPublisher } from '@/user/v1/infrastructure/events/user-created.broker-publisher';
import type { UserCreatedEvent } from '@/user/v1/domain/events/user-created.event';

@Injectable()
export class UserCreateUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private repository: IUserRepository,
    @Inject(ENCRYPTION_SERVICE)
    private readonly hasher: IEncryptionService,
    private readonly userCreatedPublisher: UserCreatedKafkaPublisher,
  ) {}

  async execute(user: User): Promise<void> {
    const existingUser: User | void = await this.repository.findByEmail(user.getEmail().valueOf());

    if (existingUser) throw new ConflictException('User with this email already exists');

    const primitives: UserPrimitives = user.toPrimitives();
    primitives.password = await this.hasher.hash(user.getPassword().valueOf());

    await this.repository.save(primitives);

    user.buildEvents();

    await this.userCreatedPublisher.publishBatch(user.pullDomainEvents() as UserCreatedEvent[]);
  }
}
