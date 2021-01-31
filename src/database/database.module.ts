import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { BootcampHook } from './hooks/bootcamp.hook';
import { UserHook } from './hooks/user.hook';
import * as configuration from 'config';
import { CourseHook } from './hooks/course.hook';
const dbConfig = configuration.get('db');

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `mongodb://localhost:27017/${dbConfig.database}`,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
    }),
    MongooseModule.forFeatureAsync([BootcampHook, UserHook, CourseHook]),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: false,
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
