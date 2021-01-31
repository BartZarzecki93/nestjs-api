import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { join } from 'path';
import { BootcampHook } from '../src/database/hooks/bootcamp.hook';
import { UserHook } from '../src/database/hooks/user.hook';
import { CourseHook } from '../src/database/hooks/course.hook';
let mongod: MongoMemoryServer;

export const rootMongooseTestModule = MongooseModule.forRootAsync({
  useFactory: async () => {
    mongod = new MongoMemoryServer();
    const mongoUri = await mongod.getUri();
    return {
      uri: mongoUri,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    };
  },
});

export const featureMongooseTestModule = MongooseModule.forFeatureAsync([
  BootcampHook,
  UserHook,
  CourseHook,
]);

export const gqlTestModule = GraphQLModule.forRoot({
  autoSchemaFile: join(process.cwd(), '../schema.gql'),
  sortSchema: true,
  playground: true,
  debug: false,
});

export const closeInMongodConnection = async () => {
  await mongod.stop();
};
