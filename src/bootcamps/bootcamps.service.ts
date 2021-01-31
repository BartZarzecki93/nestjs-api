import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBootcamp } from './dto/create-bootcamp.dto';
import { BootcampID } from './dto/id.dto';
import { UpdateBootcamp } from './dto/update-bootcamp.dto';
import { Bootcamp } from '../database/schemas/bootcamp';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payload } from '../auth/interface/payload.interface';

@Injectable()
export class BootcampsService {
  private logger = new Logger('Bootcamps');
  constructor(
    @InjectModel(Bootcamp.name) private bootcampModel: Model<Bootcamp>,
  ) {}

  async getBootcamps(): Promise<Bootcamp[]> {
    return await this.bootcampModel
      .find()
      .populate(
        'courses',
        'title description weeks tuition minimumSkill scholarshipAvailable',
      );
  }

  async getBootcamp(bootcampId: BootcampID): Promise<Bootcamp> {
    const bootcamp = await this.bootcampModel
      .findById(bootcampId.id)
      .populate(
        'courses',
        'title description weeks tuition minimumSkill scholarshipAvailable',
      );

    if (!bootcamp) {
      throw new NotFoundException(
        `Bootcamp with ${bootcampId.id} ID not found`,
      );
    }

    return bootcamp;
  }

  async createBootcamp(
    createBootcamp: CreateBootcamp,
    user: Payload,
  ): Promise<Bootcamp> {
    Object.assign(createBootcamp, { user: user._id });

    //console.log(user);
    const bootcamp = new this.bootcampModel(createBootcamp);

    return bootcamp.save();
  }

  async deleteBootcamp(bootcampId: BootcampID, payload: Payload) {
    const bootcamp = await this.bootcampModel.findById(bootcampId.id);

    if (!bootcamp) {
      this.logger.error(`Bootcamp was not found`);
      throw new NotFoundException(`Bootcamp was not found`);
    }

    if (payload._id != bootcamp.user) {
      this.logger.error(`Unauthorized`);
      throw new UnauthorizedException(`Unauthorized`);
    }

    await bootcamp.delete();
  }

  async updateBootcamp(
    bootcampId: BootcampID,
    createBootcamp: UpdateBootcamp,
    payload: Payload,
  ): Promise<Bootcamp> {
    const bootcamp = await this.bootcampModel.findById(bootcampId.id);

    if (!bootcamp) {
      throw new NotFoundException(`Bootcamp was not found`);
    }

    if (payload._id != bootcamp.user) {
      this.logger.error(`Unauthorized`);
      throw new UnauthorizedException(`Unauthorized`);
    }

    return await this.bootcampModel.findOneAndUpdate(
      { _id: bootcampId.id },
      createBootcamp,
      {
        new: true,
        runValidators: true,
        context: 'query',
      },
    );
  }
}
