import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserPrimitives } from '@/user/v1/domain/user/user';
import { UserEmail } from '@/user/v1/domain/user/user.email';
import { UserPassword } from '@/user/v1/domain/user/user.password';
import { IUserRepository, USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { ENCRYPTION_SERVICE, IEncryptionService } from '@/shared/domain/encryption/encryption.service';
import { JWT_SERVICE_TOKEN } from '@/shared/domain/jwt/JwtService';
import { IJwtService } from '@/shared/domain/jwt/JwtService';
import { TokenPair } from '@/shared/domain/tokens/TokenPair';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';

@Injectable()
export class UserLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private repository: IUserRepository,
    @Inject(ENCRYPTION_SERVICE)
    private readonly hasher: IEncryptionService,
    @Inject(JWT_SERVICE_TOKEN)
    private readonly jwtService: IJwtService,
  ) {}
  async execute(email: UserEmail, password: UserPassword): Promise<TokenPair> {
    const existingUser: User | void = await this.repository.findByEmail(email.valueOf());

    if (!existingUser) throw new NotFoundException('User does not exist.');

    const isPasswordValid: boolean = await this.hasher.compare(
      password.valueOf(),
      existingUser.getPassword().valueOf(),
    );

    if (!isPasswordValid) throw new UnauthorizedException('Invalid user password.');

    const custom: Partial<UserPrimitives> = GeneralUtils.omit(existingUser.toPrimitives(), [
      'password',
      'createdAt',
      'updatedAt',
    ]);

    const token: TokenPair = this.jwtService.sign(existingUser.getId(), existingUser.getRole().valueOf(), custom);

    return token;
  }
}
