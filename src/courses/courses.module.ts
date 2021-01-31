import { CacheModule, Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesResolver } from './courses.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../database/schemas/course';
import { AuthModule } from '../auth/auth.module';
import { Bootcamp, BootcampSchema } from '../database/schemas/bootcamp';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Bootcamp.name, schema: BootcampSchema },
    ]),
    AuthModule,
  ],
  providers: [CoursesService, CoursesResolver],
  controllers: [CoursesController],
})
export class CoursesModule {}
