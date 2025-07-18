import { LoginDTO } from '@/user/v1/gateway/dtos/login.dto';
import { validate } from 'class-validator';
import { UserEmail } from '@/user/v1/domain/user/user.email';
import { UserPassword } from '@/user/v1/domain/user/user.password';

describe('LoginDTO', () => {
  it('should be defined', () => {
    expect(new LoginDTO()).toBeDefined();
  });

  it('should validate a valid login DTO', async () => {
    const dto = new LoginDTO();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate with an invalid email', async () => {
    const dto = new LoginDTO();
    dto.email = 'invalid-email';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('email');
  });

  it('should not validate with a missing email', async () => {
    const dto = new LoginDTO();
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('email');
  });

  it('should not validate with a missing password', async () => {
    const dto = new LoginDTO();
    dto.email = 'test@example.com';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('password');
  });

  it('should create a LoginDTO from domain objects', () => {
    const email = new UserEmail('domain@example.com');
    const password = new UserPassword('domainpassword');
    const dto = LoginDTO.fromDomain(email, password);
    expect(dto.email).toEqual('domain@example.com');
    expect(dto.password).toEqual('domainpassword');
  });
});
