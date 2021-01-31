import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { BootcampSchemaProvider } from './hooks/bootcamp.hook';
import { UserSchemaProvider } from './hooks/user.provider';
import * as configuration from 'config';
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
    MongooseModule.forFeatureAsync([
      BootcampSchemaProvider,
      UserSchemaProvider,
    ]),
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
