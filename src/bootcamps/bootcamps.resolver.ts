import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Bootcamp } from '../database/schemas/bootcamp';
import { BootcampsService } from './bootcamps.service';
import { CreateBootcamp } from './dto/create-bootcamp.dto';
import { BootcampID } from './dto/id.dto';
import { UpdateBootcamp } from './dto/update-bootcamp.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Payload } from '../auth/interface/payload.interface';
import { GqlGetUser } from '../decorators/gql-get-user.decorator';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../database/enums/user.enum';
import { RolesGuardGql } from '../auth/guards/gql-roles.guard';

@Resolver(() => Bootcamp)
export class BootcampsResolver {
  constructor(private bootcampService: BootcampsService) {}

  @Query(() => Bootcamp)
  @UsePipes(ValidationPipe)
  async bootcamp(@Args('_id', { type: () => BootcampID }) _id: BootcampID) {
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
  @Roles(Role.PUBLISHER)
  @UseGuards(GqlAuthGuard)
  async updateBootcamp(
    @GqlGetUser() payload: Payload,
    @Args('_id', { type: () => BootcampID }) _id: BootcampID,
    @Args('updateBootcamp') updateBootcamp: UpdateBootcamp,
  ) {
    return this.bootcampService.updateBootcamp(_id, updateBootcamp, payload);
  }

  @Mutation(() => Bootcamp)
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(GqlAuthGuard)
  async deleteBootcamp(
    @GqlGetUser() payload: Payload,
    @Args('_id', { type: () => BootcampID }) _id: BootcampID,
  ) {
    return this.bootcampService.deleteBootcamp(_id, payload);
  }
}
