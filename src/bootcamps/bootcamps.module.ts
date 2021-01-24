import { Module } from '@nestjs/common';
import { BootcampsController } from './bootcamps.controller';
import { BootcampsService } from './bootcamps.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bootcamp, BootcampSchema } from './model/bootcamp';
import { BootcampsResolver } from './bootcamps.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bootcamp.name, schema: BootcampSchema },
    ]),
  ],
  controllers: [BootcampsController],
  providers: [BootcampsService, BootcampsResolver],
})
export class BootcampsModule {}
