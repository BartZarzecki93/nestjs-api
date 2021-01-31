import { Bootcamp, BootcampSchema } from '../schemas/bootcamp';
import slugify from 'slugify';

export const BootcampHook = {
  name: Bootcamp.name,
  useFactory: () => {
    const schema = BootcampSchema;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-unique-validator'));
    schema.pre('save', function () {
      this.slug = slugify(this.name, { lower: true });
    });
    schema.pre('remove', async function (next) {
      console.log(`Courses being removed from bootcamp ${this._id}`);
      await this.model('Course').deleteMany({
        bootcamp: this._id,
      });
      next();
    });
    return schema;
  },
};
