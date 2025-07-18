import { UserTaskPaginationDTO } from '@/user/v1/gateway/dtos/user.task.pagination.dto';
import { validate } from 'class-validator';
import { UserTask } from '@/user/v1/domain/user-task/user.task';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { User } from '@/user/v1/domain/user/user';
import { Role } from '@/shared/domain/jwt/Role';

describe('UserTaskPaginationDTO', () => {
  it('should be defined', () => {
    expect(new UserTaskPaginationDTO()).toBeDefined();
  });

  it('should validate a valid UserTaskPaginationDTO', async () => {
    const dto = new UserTaskPaginationDTO();
    dto.page = 1;
    dto.pageSize = 10;
    dto.total = 1;
    dto.elements = [
      {
        user: {
          id: 'user-id-1',
          name: 'Test User',
          email: 'test@example.com',
          role: Role.MEMBER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        completedTasksCount: 0,
        totalCompletedTasksCost: 0,
      },
    ];
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate with a missing page', async () => {
    const dto = new UserTaskPaginationDTO();
    dto.pageSize = 10;
    dto.total = 1;
    dto.elements = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('page');
  });

  it('should not validate with a missing pageSize', async () => {
    const dto = new UserTaskPaginationDTO();
    dto.page = 1;
    dto.total = 1;
    dto.elements = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('pageSize');
  });

  it('should not validate with a missing total', async () => {
    const dto = new UserTaskPaginationDTO();
    dto.page = 1;
    dto.pageSize = 10;
    dto.elements = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('total');
  });

  it('should create a UserTaskPaginationDTO from a Paginated<UserTask> domain object', () => {
    const mockUser = User.fromPrimitives({
      id: 'user-id-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: Role.MEMBER,
      createdAt: '2025-07-18T18:15:54.732Z',
      updatedAt: '2025-07-18T18:15:54.732Z',
    });

    const mockUserTask = UserTask.fromPrimitives({
      user: {
        id: 'user-id-1',
        name: 'Test User',
        email: 'test@example.com',
        password: '',
        role: Role.MEMBER,
        createdAt: '2025-07-18T18:15:54.732Z',
        updatedAt: '2025-07-18T18:15:54.732Z',
      },
      completedTasksCount: 0,
      totalCompletedTasksCost: 0,
    });

    // Manually assign the user object to the UserTask for the DTO conversion
    (mockUserTask as any).user = mockUser;

    const mockPaginatedUserTasks: Paginated<UserTask> = new Paginated([mockUserTask], 1, 10, 10);

    const dto = UserTaskPaginationDTO.fromDomain(mockPaginatedUserTasks);

    expect(dto).toEqual({
      elements: [
        {
          completedTasksCount: 0,
          totalCompletedTasksCost: 0,
          user: {
            createdAt: '2025-07-18T18:15:54.732Z',
            email: 'test@example.com',
            id: 'user-id-1',
            name: 'Test User',
            password: 'hashedpassword',
            role: 'MEMBER',
            updatedAt: '2025-07-18T18:15:54.732Z',
          },
        },
      ],
      page: 1,
      pageSize: 10,
      total: 10,
    });
  });
});
