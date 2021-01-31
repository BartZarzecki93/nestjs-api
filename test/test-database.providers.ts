import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { join } from 'path';
import { BootcampSchemaProvider } from '../src/database/hooks/bootcamp.hook';
import { UserSchemaProvider } from '../src/database/hooks/user.hook';
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
  BootcampSchemaProvider,
  UserSchemaProvider,
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
