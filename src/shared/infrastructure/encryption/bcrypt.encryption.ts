import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { IEncryptionService } from '@/shared/domain/encryption/encryption.service';

@Injectable()
export class BcryptHashService implements IEncryptionService {
  private readonly rounds: number;

  constructor(private readonly config: ConfigService) {
    this.rounds = Number(this.config.get<string>('BCRYPT_SALT_ROUNDS') ?? 10);
  }

  async hash(plain: string): Promise<string> {
    const encrypted: string = await bcrypt.hash(plain, this.rounds);
    return encrypted;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const isMatch: boolean = await bcrypt.compare(plain, hash);
    return isMatch;
  }
}
