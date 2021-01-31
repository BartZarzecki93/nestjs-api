import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payload } from '../auth/interface/payload.interface';
import { Course } from '../database/schemas/course';
import { CreateCourse } from './dto/create-course.dto';
import { CourseID } from './dto/id.dto';
import { UpdateCourse } from './dto/update-course.dto';
import { Bootcamp } from '../database/schemas/bootcamp';

@Injectable()
export class CoursesService {
  private logger = new Logger('Bootcamps');
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Bootcamp.name) private bootcampModel: Model<Bootcamp>,
  ) {}

  async getCourses(): Promise<Course[]> {
    return await this.courseModel
      .find()
      .populate('bootcamp', 'name description email phone');
  }

  async getCourse(courseId: CourseID): Promise<Course> {
    const course = await this.courseModel
      .findById(courseId.id)
      .populate('bootcamp', 'name description email phone');

    if (!course) {
      this.logger.error(`Bootcamp was not found`);
      throw new NotFoundException(`Bootcamp was not found`);
    }

    return course;
  }

  async createCourse(
    createCourse: CreateCourse,
    user: Payload,
  ): Promise<Course> {
    const bootcamp = await this.bootcampModel.findOne({
      _id: createCourse.bootcamp,
      user: user._id,
    });

    if (!bootcamp) {
      this.logger.error(`Bootcamp was not found`);
      throw new NotFoundException(`Bootcamp was not found`);
    }

    Object.assign(createCourse, { user: user._id });

    const course = new this.courseModel(createCourse);

    return course.save();
  }

  async deleteCourse(courseId: CourseID, payload: Payload) {
    const course = await this.courseModel.findById(courseId.id);

    if (!course) {
      this.logger.error(`Bootcamp was not found`);
      throw new NotFoundException(`Bootcamp was not found`);
    }

    if (payload._id != course.user) {
      this.logger.error(`Unauthorized`);
      throw new UnauthorizedException(`Unauthorized`);
    }

    await course.delete();
  }

  async updateCourse(
    courseId: CourseID,
    updateCourse: UpdateCourse,
    payload: Payload,
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId.id);

    if (!course) {
      this.logger.error(`Bootcamp was not found`);
      throw new NotFoundException(`Bootcamp was not found`);
    }

    if (payload._id != course.user) {
      this.logger.error(`Unauthorized`);
      throw new UnauthorizedException(`Unauthorized`);
    }

    return await this.courseModel.findOneAndUpdate(
      { _id: courseId.id },
      updateCourse,
      {
        new: true,
        runValidators: true,
        context: 'query',
      },
    );
  }
}
