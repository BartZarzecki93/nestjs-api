import { Module } from '@nestjs/common';
import { BootcampsModule } from './bootcamps/bootcamps.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CoursesModule } from './courses/courses.module';
@Module({
  imports: [DatabaseModule, BootcampsModule, AuthModule, CoursesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
