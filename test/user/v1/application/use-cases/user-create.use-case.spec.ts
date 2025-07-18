/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UserCreateUseCase } from '@/user/v1/application/use-cases/user-create.use-case';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { ENCRYPTION_SERVICE, IEncryptionService } from '@/shared/domain/encryption/encryption.service';
import {
  UserCreatedBrokerPublisher,
  USER_PUBLISHER_BROKER,
} from '@/user/v1/infrastructure/events/user-created.broker-publisher';
import { User } from '@/user/v1/domain/user/user';
import { Role } from '@/shared/domain/jwt/Role';
import { UserCreatedEvent } from '@/user/v1/domain/events/user-created.event';

describe('UserCreateUseCase', () => {
  let useCase: UserCreateUseCase;
  let userRepository: IUserRepository;
  let encryptionService: IEncryptionService;
  let userCreatedPublisher: UserCreatedBrokerPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCreateUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ENCRYPTION_SERVICE,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: USER_PUBLISHER_BROKER,
          useValue: {
            publishBatch: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UserCreateUseCase>(UserCreateUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
    encryptionService = module.get<IEncryptionService>(ENCRYPTION_SERVICE);
    userCreatedPublisher = module.get<UserCreatedBrokerPublisher>(USER_PUBLISHER_BROKER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw ConflictException if user with email already exists', async () => {
    const date: string = new Date().toISOString();
    const mockUser = User.fromPrimitives({
      id: 'some-id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: Role.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);

    await expect(useCase.execute(mockUser)).rejects.toThrow(ConflictException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.getEmail().valueOf());
    expect(userRepository.save).not.toHaveBeenCalled();
    expect(encryptionService.hash).not.toHaveBeenCalled();
    expect(userCreatedPublisher.publishBatch).not.toHaveBeenCalled();
  });

  it('should create a user and publish event', async () => {
    const date: string = new Date().toISOString();
    const mockUser = User.fromPrimitives({
      id: 'new-id',
      name: 'New User',
      email: 'new@example.com',
      password: 'newpassword',
      role: Role.MEMBER,
      createdAt: date,
      updatedAt: date,
    });
    const hashedPassword = 'hashedNewPassword';
    const userEvent: UserCreatedEvent = UserCreatedEvent.fromPrimitives({
      id: 'b1cd3f2c-b410-4506-ae70-2ee2979a993c',
      eventName: '',
      occurredOn: date,
      userCreatedAt: date,
      userEmail: 'user@/user.com',
      userId: 'b1cd3f2c-b410-4506-ae70-2ee2979a993c',
      userName: 'user',
      userRole: Role.MEMBER,
    });

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null as any);
    jest.spyOn(encryptionService, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(userRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(mockUser, 'pullDomainEvents').mockReturnValue([userEvent]);

    await useCase.execute(mockUser);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.getEmail().valueOf());
    expect(encryptionService.hash).toHaveBeenCalledWith(mockUser.getPassword().valueOf());
    expect(userRepository.save).toHaveBeenCalledWith({
      ...mockUser.toPrimitives(),
      password: hashedPassword,
    });
    expect(userCreatedPublisher.publishBatch).toHaveBeenCalledWith([userEvent]);
  });
});
