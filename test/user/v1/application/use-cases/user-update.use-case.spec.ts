/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserUpdateUseCase } from '@/user/v1/application/use-cases/user-update.use-case';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserId } from '@/user/v1/domain/user/user.id';
import { UserName } from '@/user/v1/domain/user/user.name';
import { Role } from '@/shared/domain/tokens/Role';
import { NotFoundException } from '@nestjs/common';
import { User } from '@/user/v1/domain/user/user';
import { Role as JwtRole } from '@/shared/domain/jwt/Role';

describe('UserUpdateUseCase', () => {
  let useCase: UserUpdateUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUpdateUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            updateById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UserUpdateUseCase>(UserUpdateUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const userId = new UserId('non-existent-id');
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null as any);

    await expect(useCase.execute(userId, new UserName('New Name'))).rejects.toThrow(NotFoundException);
    expect(userRepository.findById).toHaveBeenCalledWith(userId.valueOf());
    expect(userRepository.updateById).not.toHaveBeenCalled();
  });

  it('should update user name and role', async () => {
    const date: string = new Date().toISOString();
    const userId = new UserId('existing-id');
    const userName = new UserName('Updated Name');
    const userRole = new Role(JwtRole.ADMIN);
    const mockUser = User.fromPrimitives({
      id: userId.valueOf(),
      name: 'Old Name',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: JwtRole.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'updateById').mockResolvedValue(undefined);

    await useCase.execute(userId, userName, userRole);

    expect(userRepository.findById).toHaveBeenCalledWith(userId.valueOf());
    expect(userRepository.updateById).toHaveBeenCalledWith(userId.valueOf(), {
      name: userName.valueOf(),
      role: userRole.valueOf(),
    });
  });

  it('should update only user name if role is not provided', async () => {
    const date: string = new Date().toISOString();
    const userId = new UserId('existing-id');
    const userName = new UserName('Updated Name Only');
    const mockUser = User.fromPrimitives({
      id: userId.valueOf(),
      name: 'Old Name',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: JwtRole.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'updateById').mockResolvedValue(undefined);

    await useCase.execute(userId, userName);

    expect(userRepository.findById).toHaveBeenCalledWith(userId.valueOf());
    expect(userRepository.updateById).toHaveBeenCalledWith(userId.valueOf(), {
      name: userName.valueOf(),
      role: undefined,
    });
  });

  it('should update only user role if name is not provided', async () => {
    const date: string = new Date().toISOString();
    const userId = new UserId('existing-id');
    const userRole = new Role(JwtRole.ADMIN);
    const mockUser = User.fromPrimitives({
      id: userId.valueOf(),
      name: 'Old Name',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: JwtRole.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'updateById').mockResolvedValue(undefined);

    await useCase.execute(userId, undefined, userRole);

    expect(userRepository.findById).toHaveBeenCalledWith(userId.valueOf());
    expect(userRepository.updateById).toHaveBeenCalledWith(userId.valueOf(), {
      name: undefined,
      role: userRole.valueOf(),
    });
  });
});
