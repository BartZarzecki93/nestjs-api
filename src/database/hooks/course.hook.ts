import { Course, CourseSchema } from '../schemas/course';

export const CourseSchemaProvider = {
  name: Course.name,
  useFactory: () => {
    const schema = CourseSchema;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-unique-validator'));

    return schema;
  },
};
