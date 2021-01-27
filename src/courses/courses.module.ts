import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesResolver } from './courses.resolver';

@Module({
  providers: [CoursesService, CoursesResolver],
  controllers: [CoursesController]
})
export class CoursesModule {}
