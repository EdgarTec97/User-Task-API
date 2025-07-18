import { UserDTO } from '@/user/v1/gateway/dtos/user.dto';
import { validate } from 'class-validator';
import { User } from '@/user/v1/domain/user/user';
import { Role } from '@/shared/domain/jwt/Role';

describe('UserDTO', () => {
  it('should be defined', () => {
    expect(new UserDTO()).toBeDefined();
  });

  it('should validate a valid UserDTO', async () => {
    const dto = new UserDTO();
    dto.id = '6a2afbe5-267a-4de4-8d32-94eed09482cd';
    dto.name = 'Test User';
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.role = Role.MEMBER;
    dto.createdAt = '2023-10-01T12:00:00Z';
    dto.updatedAt = '2023-10-01T12:00:00Z';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a UserDTO with only required fields', async () => {
    const dto = new UserDTO();
    dto.name = 'Required User';
    dto.email = 'required@example.com';
    dto.password = 'requiredpassword';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate with a missing name', async () => {
    const dto = new UserDTO();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('name');
  });

  it('should not validate with an invalid email', async () => {
    const dto = new UserDTO();
    dto.name = 'Test User';
    dto.email = 'invalid-email';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('email');
  });

  it('should not validate with a missing password', async () => {
    const dto = new UserDTO();
    dto.name = 'Test User';
    dto.email = 'test@example.com';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('password');
  });

  it('should not validate with an invalid UUID for id', async () => {
    const dto = new UserDTO();
    dto.id = 'invalid-uuid';
    dto.name = 'Test User';
    dto.email = 'test@example.com';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('id');
  });

  it('should not validate with an invalid role enum', async () => {
    const dto = new UserDTO();
    dto.name = 'Test User';
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.role = 'INVALID_ROLE' as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('role');
  });

  it('should create a UserDTO from a User domain object', () => {
    const mockUser = User.fromPrimitives({
      id: 'user-id-123',
      name: 'Domain User',
      email: 'domain@example.com',
      password: 'hashedpassword',
      role: Role.ADMIN,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });

    const userDto = UserDTO.fromDomain(mockUser);

    expect(userDto.id).toEqual('user-id-123');
    expect(userDto.name).toEqual('Domain User');
    expect(userDto.email).toEqual('domain@example.com');
    expect(userDto.role).toEqual(Role.ADMIN);
    expect(userDto.createdAt).toEqual(mockUser.toPrimitives().createdAt); // Compare string representations
    expect(userDto.updatedAt).toEqual(mockUser.toPrimitives().updatedAt); // Compare string representations
    expect(userDto.password).toBeUndefined(); // Password should not be exposed in DTO from domain
  });
});
