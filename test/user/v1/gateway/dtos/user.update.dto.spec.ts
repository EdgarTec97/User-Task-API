import { UserUpdateDTO } from '@/user/v1/gateway/dtos/user.update.dto';
import { validate } from 'class-validator';
import { Role } from '@/shared/domain/jwt/Role';

describe('UserUpdateDTO', () => {
  it('should be defined', () => {
    expect(new UserUpdateDTO()).toBeDefined();
  });

  it('should validate a valid UserUpdateDTO with name and role', async () => {
    const dto = new UserUpdateDTO();
    dto.name = 'Updated Name';
    dto.role = Role.ADMIN;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid UserUpdateDTO with only name', async () => {
    const dto = new UserUpdateDTO();
    dto.name = 'Updated Name Only';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid UserUpdateDTO with only role', async () => {
    const dto = new UserUpdateDTO();
    dto.role = Role.MEMBER;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate with an invalid role enum', async () => {
    const dto = new UserUpdateDTO();
    dto.name = 'Test User';
    dto.role = 'INVALID_ROLE' as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('role');
  });

  it('should not validate if name is not a string', async () => {
    const dto = new UserUpdateDTO();
    dto.name = 123 as any; // Intentionally wrong type
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('name');
  });
});
