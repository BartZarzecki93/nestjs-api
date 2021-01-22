import { Module } from '@nestjs/common';
import { BootcampsController } from './bootcamps.controller';
import { BootcampsService } from './bootcamps.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bootcamp, BootcampSchema } from './model/Bootcamp';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bootcamp.name, schema: BootcampSchema },
    ]),
  ],
  controllers: [BootcampsController],
  providers: [BootcampsService],
})
export class BootcampsModule {}
