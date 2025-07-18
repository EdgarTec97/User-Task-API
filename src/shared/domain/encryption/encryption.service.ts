export interface IEncryptionService {
  /**
   * Hash a plaintext value (e.g. password).
   * @param plain plaintext string
   * @returns hashed string
   */
  hash(plain: string): Promise<string>;

  /**
   * Compare plaintext vs hash.
   * @returns true if matches
   */
  compare(plain: string, hash: string): Promise<boolean>;
}

/** DI token */
export const ENCRYPTION_SERVICE = Symbol('ENCRYPTION_SERVICE');
