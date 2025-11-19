import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/Entity/user.entity';

export const ROLES_KEY = 'roles';
export const Role = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
    