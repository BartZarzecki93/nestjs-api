import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BootcampsModule } from './bootcamps/bootcamps.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BootcampSchemaProvider } from './bootcamps/model/BootcampProvider';

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
    MongooseModule.forFeatureAsync([BootcampSchemaProvider]),
    BootcampsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
