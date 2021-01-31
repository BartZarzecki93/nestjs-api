import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { Payload } from '../auth/interface/payload.interface';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../database/enums/user.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CoursesService } from './courses.service';
import { Course } from '../database/schemas/course';
import { CreateCourse } from './dto/create-course.dto';
import { CourseID } from './dto/id.dto';
import { UpdateCourse } from './dto/update-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  private logger = new Logger('Bootcamps');

  constructor(
    private coursesService: CoursesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({
    summary: `Get all courses`,
  })
  @Get()
  async getCourses(): Promise<Course[]> {
    const inMem: Course[] = await this.cacheManager.get('courses');
    if (inMem) {
      return inMem;
    }
    const courses = await this.coursesService.getCourses();
    await this.cacheManager.set('courses', courses, { ttl: 1000 });

    return courses;
  }

  @ApiOperation({
    summary: `Get course by Id`,
  })
  @Get(':id')
  @UsePipes(ValidationPipe)
  async getCourse(@Param() id: CourseID): Promise<Course> {
    return await this.coursesService.getCourse(id);
  }

  @ApiOperation({
    summary: `Create course`,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Course,
  })
  @Post()
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  async createCourse(
    @GetUser() payload: Payload,
    @Body() createCourse: CreateCourse,
  ): Promise<Course> {
    this.logger.verbose(
      `User ${payload._id} creating bootcamp. Data: ${JSON.stringify(
        createCourse,
      )}`,
    );
    return await this.coursesService.createCourse(createCourse, payload);
  }

  @ApiOperation({
    summary: `Delete course by Id`,
  })
  @Delete(':id')
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  async deleteCourse(
    @GetUser() payload: Payload,
    @Param() id: CourseID,
  ): Promise<void> {
    this.logger.verbose(`User ${payload._id} deleting bootcamp ${id.id}`);
    return this.coursesService.deleteCourse(id, payload);
  }

  @ApiOperation({
    summary: `Update course by Id`,
  })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  async updateBootcamp(
    @GetUser() payload: Payload,
    @Body() updateCourse: UpdateCourse,
    @Param() id: CourseID,
  ): Promise<Course> {
    this.logger.verbose(`User ${payload._id} updating bootcamp ${id.id}`);
    return this.coursesService.updateCourse(id, updateCourse, payload);
  }
}
