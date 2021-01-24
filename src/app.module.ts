import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BootcampsModule } from './bootcamps/bootcamps.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BootcampSchemaProvider } from './bootcamps/model/bootcamp.provider';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/dev-camps-test',
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: false,
    }),
    MongooseModule.forFeatureAsync([BootcampSchemaProvider]),
    BootcampsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
