import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENCRYPTION_SERVICE } from '@/shared/domain/encryption/encryption.service';
import { BcryptHashService } from '@/shared/infrastructure/encryption/bcrypt.encryption';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [BcryptHashService, { provide: ENCRYPTION_SERVICE, useExisting: BcryptHashService }],
  exports: [ENCRYPTION_SERVICE],
})
export class CryptoModule {}
