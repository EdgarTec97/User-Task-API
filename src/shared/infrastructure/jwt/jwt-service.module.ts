import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtServiceNest } from '@/shared/infrastructure/jwt/bootstrap/JwtServiceNest';
import { JWT_SERVICE_TOKEN } from '@/shared/domain/jwt/JwtService';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        privateKey: cfg.get<string>('JWT_PRIVATE_KEY')!.replace(/\\n/g, '\n'),
        publicKey: cfg.get<string>('JWT_PUBLIC_KEY')!.replace(/\\n/g, '\n'),
        signOptions: {
          algorithm: cfg.get<'RS256'>('JWT_ALGORITHM')!,
          expiresIn: cfg.get<string>('JWT_EXPIRATION_TIME')!,
        },
      }),
    }),
  ],
  providers: [
    JwtServiceNest,
    {
      provide: JWT_SERVICE_TOKEN,
      useExisting: JwtServiceNest,
    },
  ],

  exports: [JWT_SERVICE_TOKEN],
})
export class AuthModule {}
