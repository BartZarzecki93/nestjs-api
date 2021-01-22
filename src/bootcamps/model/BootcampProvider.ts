import { Bootcamp, BootcampSchema } from './Bootcamp';
import slugify from 'slugify';

export const BootcampSchemaProvider = {
  name: Bootcamp.name,
  useFactory: () => {
    const schema = BootcampSchema;
    schema.pre('save', function () {
      console.log('Hello from pre save');
      this.slug = slugify(this.name, { lower: true });
    });
    return schema;
  },
};
