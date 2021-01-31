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
import { BootcampsService } from './bootcamps.service';
import { CreateBootcamp } from './dto/create-bootcamp.dto';
import { BootcampID } from './dto/id.dto';
import { UpdateBootcamp } from './dto/update-bootcamp.dto';
import { Bootcamp } from '../database/schemas/bootcamp';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { Payload } from '../auth/interface/payload.interface';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../database/enums/user.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
@ApiTags('Bootcamps')
@Controller('bootcamps')
export class BootcampsController {
  private logger = new Logger('Bootcamps');
  constructor(
    private bootcampsService: BootcampsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({
    summary: `Get all bootcamps`,
  })
  @Get()
  async getAllBootcamps(): Promise<Bootcamp[]> {
    const inMem: Bootcamp[] = await this.cacheManager.get('bootcamps');
    if (inMem) {
      return inMem;
    }
    const bootcamps = await this.bootcampsService.getBootcamps();
    await this.cacheManager.set('bootcamps', bootcamps, { ttl: 1000 });

    return bootcamps;
  }

  @ApiOperation({
    summary: `Get bootcamp by Id`,
  })
  @Get(':id')
  @UsePipes(ValidationPipe)
  async getBootcamp(@Param() id: BootcampID): Promise<Bootcamp> {
    return await this.bootcampsService.getBootcamp(id);
  }

  @ApiOperation({
    summary: `Create Bootcamp`,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Bootcamp,
  })
  @Post()
  @UsePipes(ValidationPipe)
  //@Roles(Role.PUBLISHER)
  @UseGuards(AuthGuard()) //RolesGuard)
  @ApiBearerAuth()
  async createBootcamp(
    @GetUser() payload: Payload,
    @Body() createBootcamp: CreateBootcamp,
  ): Promise<Bootcamp> {
    this.logger.verbose(
      `User ${payload._id} creating bootcamp. Data: ${JSON.stringify(
        createBootcamp,
      )}`,
    );
    return await this.bootcampsService.createBootcamp(createBootcamp, payload);
  }

  @ApiOperation({
    summary: `Delete bootcamp by Id`,
  })
  @Delete(':id')
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  async deleteBootcamp(
    @GetUser() payload: Payload,
    @Param() id: BootcampID,
  ): Promise<void> {
    this.logger.verbose(`User ${payload._id} deleting bootcamp ${id.id}`);
    return this.bootcampsService.deleteBootcamp(id, payload);
  }

  @ApiOperation({
    summary: `Update bootcamp by Id`,
  })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @Roles(Role.PUBLISHER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  async updateBootcamp(
    @GetUser() payload: Payload,
    @Body() createBootcamp: UpdateBootcamp,
    @Param() id: BootcampID,
  ): Promise<Bootcamp> {
    this.logger.verbose(`User ${payload._id} updating bootcamp ${id.id}`);
    return this.bootcampsService.updateBootcamp(id, createBootcamp, payload);
  }
}
