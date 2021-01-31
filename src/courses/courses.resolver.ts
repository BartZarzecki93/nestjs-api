import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CourseID } from './dto/id.dto';

import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Payload } from '../auth/interface/payload.interface';
import { GqlGetUser } from '../decorators/gql-get-user.decorator';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../database/enums/user.enum';
import { RolesGuardGql } from '../auth/guards/gql-roles.guard';
import { CoursesService } from './courses.service';
import { Course } from '../database/schemas/course';
import { CreateCourse } from './dto/create-course.dto';
import { UpdateCourse } from './dto/update-course.dto';
@Resolver()
export class CoursesResolver {
  constructor(private courseService: CoursesService) {}

  @Query(() => Course)
  @UsePipes(ValidationPipe)
  async course(@Args('_id', { type: () => CourseID }) _id: CourseID) {
    return this.courseService.getCourse(_id);
  }

  @Query(() => [Course])
  async courses() {
    return this.courseService.getCourses();
  }

  @Mutation(() => Course)
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(GqlAuthGuard, RolesGuardGql)
  async createCourse(
    @GqlGetUser() user: Payload,
    @Args('createCourse') createCourse: CreateCourse,
  ) {
    return this.courseService.createCourse(createCourse, user);
  }

  @Mutation(() => Course)
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(GqlAuthGuard)
  async updateCourse(
    @GqlGetUser() user: Payload,
    @Args('_id', { type: () => CourseID }) _id: CourseID,
    @Args('updateCourse') updateCourse: UpdateCourse,
  ) {
    return this.courseService.updateCourse(_id, updateCourse, user);
  }

  @Mutation(() => Course)
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(GqlAuthGuard)
  async deleteCourse(
    @GqlGetUser() user: Payload,
    @Args('_id', { type: () => CourseID }) _id: CourseID,
  ) {
    return this.courseService.deleteCourse(_id, user);
  }
}
