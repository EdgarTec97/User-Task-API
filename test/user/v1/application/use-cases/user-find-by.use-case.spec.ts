/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserFindOneUseCase } from '@/user/v1/application/use-cases/user-find-by.use-case';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserId } from '@/user/v1/domain/user/user.id';
import { User } from '@/user/v1/domain/user/user';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@/shared/domain/jwt/Role';

describe('UserFindOneUseCase', () => {
  let useCase: UserFindOneUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFindOneUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UserFindOneUseCase>(UserFindOneUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a user if found', async () => {
    const date: string = new Date().toISOString();
    const userId = new UserId('some-user-id');
    const mockUser = User.fromPrimitives({
      id: userId.valueOf(),
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: Role.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

    const result = await useCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId.valueOf());
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user is not found', async () => {
    const userId = new UserId('non-existent-id');

    jest.spyOn(userRepository, 'findById').mockResolvedValue(null as any);

    await expect(useCase.execute(userId)).rejects.toThrow(NotFoundException);
    expect(userRepository.findById).toHaveBeenCalledWith(userId.valueOf());
  });
});
