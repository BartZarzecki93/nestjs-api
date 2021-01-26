import { CacheModule, Module } from '@nestjs/common';
import { BootcampsController } from './bootcamps.controller';
import { BootcampsService } from './bootcamps.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bootcamp, BootcampSchema } from '../database/schemas/bootcamp';
import { BootcampsResolver } from './bootcamps.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Bootcamp.name, schema: BootcampSchema },
    ]),
    AuthModule,
  ],
  controllers: [BootcampsController],
  providers: [BootcampsService, BootcampsResolver],
})
export class BootcampsModule {}
