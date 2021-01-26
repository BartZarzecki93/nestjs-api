import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  USER = 'user',
  PUBLISHER = 'publisher',
  ADMIN = 'admin',
}

registerEnumType(Role, {
  name: 'Roles',
  description: 'The supported roles.',
});
