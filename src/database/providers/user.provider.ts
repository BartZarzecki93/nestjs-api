import { User, UserSchema } from '../schemas/user';
import { genSalt, hash } from 'bcryptjs';

export const UserSchemaProvider = {
  name: User.name,
  useFactory: () => {
    const schema = UserSchema;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-unique-validator'));
    schema.pre('save', async function (next) {
      if (!this.isModified('password')) {
        next();
      }
      const salt = await genSalt(10);
      this.password = await hash(this.password, salt);
    });
    return schema;
  },
};
