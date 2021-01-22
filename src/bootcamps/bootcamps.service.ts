import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBootcamp, GetBootcamp } from './dto/bootcamp';
import { Bootcamp } from './model/Bootcamp';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';

@Injectable()
export class BootcampsService {
  constructor(
    @InjectModel(Bootcamp.name) private bootcampModel: Model<Bootcamp>,
  ) {}

  async getBootcamps(): Promise<Bootcamp[]> {
    return await this.bootcampModel.find();
  }

  async getBootcamp(bootcampId: GetBootcamp): Promise<Bootcamp> {
    const bootcamp = await this.bootcampModel.findById(bootcampId.id);

    if (!bootcamp) {
      throw new NotFoundException(
        `Bootcamp with ${bootcampId.id} ID not found`,
      );
    }

    return bootcamp;
  }

  async createBootcamp(createBootcamp: CreateBootcamp): Promise<Bootcamp> {
    const bootcamp = new this.bootcampModel(createBootcamp);
    return bootcamp.save();
  }

  async deleteBootcamp(bootcampId: GetBootcamp): Promise<void> {
    await this.bootcampModel.findByIdAndDelete(bootcampId.id);
  }

  async updateBootcamp(
    bootcampId: GetBootcamp,
    createBootcamp: CreateBootcamp,
  ): Promise<Bootcamp> {
    const bootcamp = await this.getBootcamp(bootcampId);

    return await this.bootcampModel.findOneAndUpdate(
      { _id: bootcamp._id },
      createBootcamp,
      {
        new: true,
        runValidators: true,
      },
    );
  }
}
