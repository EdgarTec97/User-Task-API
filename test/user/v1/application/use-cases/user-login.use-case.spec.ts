/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UserLoginUseCase } from '@/user/v1/application/use-cases/user-login.use-case';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { ENCRYPTION_SERVICE, IEncryptionService } from '@/shared/domain/encryption/encryption.service';
import { JWT_SERVICE_TOKEN, IJwtService } from '@/shared/domain/jwt/JwtService';
import { UserEmail } from '@/user/v1/domain/user/user.email';
import { UserPassword } from '@/user/v1/domain/user/user.password';
import { User } from '@/user/v1/domain/user/user';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TokenPair } from '@/shared/domain/tokens/TokenPair';
import { Role } from '@/shared/domain/jwt/Role';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';

describe('UserLoginUseCase', () => {
  let useCase: UserLoginUseCase;
  let userRepository: IUserRepository;
  let encryptionService: IEncryptionService;
  let jwtService: IJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLoginUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: ENCRYPTION_SERVICE,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: JWT_SERVICE_TOKEN,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UserLoginUseCase>(UserLoginUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
    encryptionService = module.get<IEncryptionService>(ENCRYPTION_SERVICE);
    jwtService = module.get<IJwtService>(JWT_SERVICE_TOKEN);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const email = new UserEmail('nonexistent@example.com');
    const password = new UserPassword('password123');

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null as any);

    await expect(useCase.execute(email, password)).rejects.toThrow(NotFoundException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email.valueOf());
    expect(encryptionService.compare).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const date: string = new Date().toISOString();
    const email = new UserEmail('test@example.com');
    const password = new UserPassword('wrongpassword');
    const mockUser = User.fromPrimitives({
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: Role.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(encryptionService, 'compare').mockResolvedValue(false);

    await expect(useCase.execute(email, password)).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email.valueOf());
    expect(encryptionService.compare).toHaveBeenCalledWith(password.valueOf(), mockUser.getPassword().valueOf());
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should return a TokenPair on successful login', async () => {
    const date: string = new Date().toISOString();
    const email = new UserEmail('test@example.com');
    const password = new UserPassword('correctpassword');
    const mockUser = User.fromPrimitives({
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: Role.MEMBER,
      createdAt: date,
      updatedAt: date,
    });
    const mockTokenPair = TokenPair.fromPrimitives({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expirationTime: '3600y',
    });

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(encryptionService, 'compare').mockResolvedValue(true);
    jest
      .spyOn(GeneralUtils, 'omit')
      .mockReturnValue({ id: 'user-id', name: 'Test User', email: 'test@example.com', role: Role.MEMBER });
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockTokenPair);

    const result = await useCase.execute(email, password);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(email.valueOf());
    expect(encryptionService.compare).toHaveBeenCalledWith(password.valueOf(), mockUser.getPassword().valueOf());
    expect(GeneralUtils.omit).toHaveBeenCalledWith(mockUser.toPrimitives(), ['password', 'createdAt', 'updatedAt']);
    expect(jwtService.sign).toHaveBeenCalledWith(mockUser.getId(), mockUser.getRole().valueOf(), {
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: Role.MEMBER,
    });
    expect(result).toEqual(mockTokenPair);
  });
});
