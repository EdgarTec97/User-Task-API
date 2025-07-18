import { UserPaginationDTO } from '@/user/v1/gateway/dtos/user.pagination.dto';
import { validate } from 'class-validator';
import { User } from '@/user/v1/domain/user/user';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { Role } from '@/shared/domain/jwt/Role';

describe('UserPaginationDTO', () => {
  it('should be defined', () => {
    expect(new UserPaginationDTO()).toBeDefined();
  });

  it('should validate a valid UserPaginationDTO', async () => {
    const dto = new UserPaginationDTO();
    dto.page = 1;
    dto.pageSize = 10;
    dto.total = 1;
    dto.elements = [
      {
        id: 'user-id-1',
        name: 'Test User',
        email: 'test@example.com',
        role: Role.MEMBER,
        createdAt: '2025-07-18T18:15:54.732Z',
        updatedAt: '2025-07-18T18:15:54.732Z',
      },
    ];
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate with a missing page', async () => {
    const dto = new UserPaginationDTO();
    dto.pageSize = 10;
    dto.total = 1;
    dto.elements = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('page');
  });

  it('should not validate with a missing pageSize', async () => {
    const dto = new UserPaginationDTO();
    dto.page = 1;
    dto.total = 1;
    dto.elements = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('pageSize');
  });

  it('should not validate with a missing total', async () => {
    const dto = new UserPaginationDTO();
    dto.page = 1;
    dto.pageSize = 10;
    dto.elements = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('total');
  });

  it('should create a UserPaginationDTO from a Paginated<User> domain object', () => {
    const mockUser = User.fromPrimitives({
      id: 'user-id-123',
      name: 'Paginated User',
      email: 'paginated@example.com',
      password: 'hashedpassword',
      role: Role.MEMBER,
      createdAt: '2025-07-18T18:15:54.732Z',
      updatedAt: '2025-07-18T18:15:54.732Z',
    });

    const mockPaginatedUsers: Paginated<User> = new Paginated([mockUser], 1, 10, 10);

    const dto = UserPaginationDTO.fromDomain(mockPaginatedUsers);

    expect(dto).toEqual({
      elements: [
        {
          createdAt: '2025-07-18T18:15:54.732Z',
          email: 'paginated@example.com',
          id: 'user-id-123',
          name: 'Paginated User',
          password: 'hashedpassword',
          role: 'MEMBER',
          updatedAt: '2025-07-18T18:15:54.732Z',
        },
      ],
      page: 1,
      pageSize: 10,
      total: 10,
    });
  });
});
