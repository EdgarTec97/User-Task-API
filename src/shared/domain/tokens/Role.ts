import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { Role as GeneralRoles } from '@/shared/domain/jwt/Role';

export class Role extends SingleValueObject<GeneralRoles> {
  constructor(role: GeneralRoles) {
    super(role);
  }

  validate(): boolean {
    return [GeneralRoles.ADMIN, GeneralRoles.REFRESH_TOKEN, GeneralRoles.MEMBER].includes(
      this.valueOf() as GeneralRoles,
    );
  }
}
