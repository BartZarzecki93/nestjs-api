import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Bootcamp } from '../database/schemas/bootcamp';
import { BootcampsService } from './bootcamps.service';
import { CreateBootcamp } from './dto/create-bootcamp.dto';
import { GetBootcamp } from './dto/get-bootcamp.dto';
import { UpdateBootcamp } from './dto/update-bootcamp.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Payload } from 'src/auth/interface/payload.interface';
import { GqlGetUser } from 'src/decorators/gql-get-user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/database/enums/user.enum';
import { RolesGuardGql } from 'src/auth/guards/gql-roles.guard';

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
  @Roles(Role.PUBLISHER)
  @UseGuards(GqlAuthGuard, RolesGuardGql)
  async createBootcamp(
    @GqlGetUser() payload: Payload,
    @Args('createBootcamp') createBootcamp: CreateBootcamp,
  ) {
    return this.bootcampService.createBootcamp(createBootcamp, payload);
  }

  @Mutation(() => Bootcamp)
  @UsePipes(ValidationPipe)
  @UseGuards(GqlAuthGuard)
  async updateBootcamp(
    @GqlGetUser() payload: Payload,
    @Args('_id', { type: () => GetBootcamp }) _id: GetBootcamp,
    @Args('updateBootcamp') updateBootcamp: UpdateBootcamp,
  ) {
    return this.bootcampService.updateBootcamp(_id, updateBootcamp, payload);
  }

  @Mutation(() => Bootcamp)
  @UsePipes(ValidationPipe)
  @UseGuards(GqlAuthGuard)
  async deleteBootcamp(
    @GqlGetUser() payload: Payload,
    @Args('_id', { type: () => GetBootcamp }) _id: GetBootcamp,
  ) {
    return this.bootcampService.deleteBootcamp(_id, payload);
  }
}
