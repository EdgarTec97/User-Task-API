/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserFindUseCase } from '@/user/v1/application/use-cases/user-find.use-case';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserPagination } from '@/user/v1/domain/pagination/user.pagination';
import { User } from '@/user/v1/domain/user/user';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { Role } from '@/shared/domain/jwt/Role';

describe('UserFindUseCase', () => {
  let useCase: UserFindUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFindUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UserFindUseCase>(UserFindUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return paginated users', async () => {
    const date: string = new Date().toISOString();
    const pagination = UserPagination.fromPrimitives({
      page: 1,
      pageSize: 10,
      name: 'test',
      email: 'test@example.com',
      role: Role.MEMBER,
    });

    const mockUser = User.fromPrimitives({
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: Role.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    const mockPaginatedUsers: Paginated<User> = new Paginated([mockUser], 1, 10, 10);

    jest.spyOn(userRepository, 'find').mockResolvedValue(mockPaginatedUsers);

    const result = await useCase.execute(pagination);

    expect(userRepository.find).toHaveBeenCalledWith(pagination.toPrimitives());
    expect(result).toEqual(mockPaginatedUsers);
  });

  it('should return empty paginated users if no records found', async () => {
    const pagination = UserPagination.fromPrimitives({
      page: 1,
      pageSize: 10,
      name: 'nonexistent',
      email: 'nonexistent@example.com',
      role: Role.MEMBER,
    });

    const mockPaginatedUsers: Paginated<User> = new Paginated([], 1, 10, 10);

    jest.spyOn(userRepository, 'find').mockResolvedValue(mockPaginatedUsers);

    const result = await useCase.execute(pagination);

    expect(userRepository.find).toHaveBeenCalledWith(pagination.toPrimitives());
    expect(result).toEqual(mockPaginatedUsers);
  });
});
