import { Bootcamp, BootcampSchema } from './bootcamp';
import slugify from 'slugify';

export const BootcampSchemaProvider = {
  name: Bootcamp.name,
  useFactory: () => {
    const schema = BootcampSchema;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-unique-validator'));
    schema.pre('save', function () {
      console.log('Hello from pre save');
      this.slug = slugify(this.name, { lower: true });
    });
    return schema;
  },
};
