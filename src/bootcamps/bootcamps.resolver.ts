import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Bootcamp } from './model/bootcamp';
import { BootcampsService } from './bootcamps.service';
import {
  GetBootcamp,
  CreateBootcamp,
  UpdateBootcamp,
} from './dto/bootcamp.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver(() => Bootcamp)
export class BootcampsResolver {
  constructor(private bootcampService: BootcampsService) {}

  @Query(() => Bootcamp)
  @UsePipes(ValidationPipe)
  async bootcamp(@Args('_id', { type: () => GetBootcamp }) _id: GetBootcamp) {
    return this.bootcampService.getBootcamp(_id);
  }

  @Query(() => [Bootcamp])
  async bootcamps() {
    return this.bootcampService.getBootcamps();
  }

  @Mutation(() => Bootcamp)
  @UsePipes(ValidationPipe)
  async createBootcamp(@Args('createBootcamp') createBootcamp: CreateBootcamp) {
    return this.bootcampService.createBootcamp(createBootcamp);
  }

  @Mutation(() => Bootcamp)
  @UsePipes(ValidationPipe)
  async updateBootcamp(
    @Args('_id', { type: () => GetBootcamp }) _id: GetBootcamp,
    @Args('updateBootcamp') updateBootcamp: UpdateBootcamp,
  ) {
    return this.bootcampService.updateBootcamp(_id, updateBootcamp);
  }

  @Mutation(() => Bootcamp)
  @UsePipes(ValidationPipe)
  async deleteBootcamp(@Args('_id', { type: () => String }) _id: GetBootcamp) {
    return this.bootcampService.deleteBootcamp(_id);
  }
}
