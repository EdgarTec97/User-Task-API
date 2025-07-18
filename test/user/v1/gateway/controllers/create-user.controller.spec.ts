/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserController } from '@/user/v1/gateway/controllers/create-user.controller';
import { UserCreateUseCase } from '@/user/v1/application/use-cases/user-create.use-case';
import { UserDTO } from '@/user/v1/gateway/dtos/user.dto';
import { StatusResponseDTO } from '@/shared/infrastructure/meta/dtos/StatusResponseDTO';
import { User } from '@/user/v1/domain/user/user';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';
import { Role } from '@/shared/domain/jwt/Role';

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let useCase: UserCreateUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: UserCreateUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateUserController>(CreateUserController);
    useCase = module.get<UserCreateUseCase>(UserCreateUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user with provided ID and role', async () => {
    const userDto: UserDTO = {
      id: 'test-id-123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: Role.ADMIN,
    };

    const mockDate = '2025-07-18T12:00:00.000Z';
    jest.spyOn(GeneralUtils, 'currentDate').mockReturnValue(mockDate);
    jest.spyOn(GeneralUtils, 'uuid').mockReturnValue('generated-uuid');

    const expectedUser = User.fromPrimitives({
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
      role: userDto.role,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined);

    const result = await controller.execute(userDto);

    expect(useCase.execute).toHaveBeenCalledWith(expectedUser);
    expect(result).toEqual(StatusResponseDTO.ok());
  });

  it('should create a user with generated ID and default role if not provided', async () => {
    const userDto: UserDTO = {
      name: 'Another User',
      email: 'another@example.com',
      password: 'anotherpassword',
      role: Role.MEMBER,
      id: undefined as any,
    };

    const mockDate = '2025-07-18T12:00:00.000Z';
    const generatedUuid = 'b1cd3f2c-b410-4506-ae70-2ee2979a993c';
    jest.spyOn(GeneralUtils, 'currentDate').mockReturnValue(mockDate);
    jest.spyOn(GeneralUtils, 'uuid').mockReturnValue(generatedUuid);

    const expectedUser = User.fromPrimitives({
      id: generatedUuid,
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
      role: Role.MEMBER, // Default role
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined);

    const result = await controller.execute(userDto);

    expect(useCase.execute).toHaveBeenCalledWith(expectedUser);
    expect(result).toEqual(StatusResponseDTO.ok());
  });
});
