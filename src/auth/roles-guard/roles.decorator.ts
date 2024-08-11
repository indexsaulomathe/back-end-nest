import { SetMetadata } from '@nestjs/common';

export interface Roles {
  admin: string;
  user: string;
}

export const Roles = (...roles: (keyof Roles)[]) => SetMetadata('roles', roles);
