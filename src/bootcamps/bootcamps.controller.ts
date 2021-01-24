import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { BootcampsService } from './bootcamps.service';
import {
  CreateBootcamp,
  GetBootcamp,
  UpdateBootcamp,
} from './dto/bootcamp.dto';
import { Bootcamp } from './model/bootcamp';

@ApiTags('Bootcamps')
@Controller('bootcamps')
export class BootcampsController {
  constructor(private bootcampsService: BootcampsService) {}

  @ApiOperation({
    summary: `Get all bootcamps`,
  })
  @Get()
  async getAllBootcamps(): Promise<Bootcamp[]> {
    return await this.bootcampsService.getBootcamps();
  }

  @ApiOperation({
    summary: `Get bootcamp by Id`,
  })
  @Get(':id')
  @UsePipes(ValidationPipe)
  async getBootcamp(@Param() id: GetBootcamp): Promise<Bootcamp> {
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
  async createBootcamp(
    @Body() createBootcamp: CreateBootcamp,
  ): Promise<Bootcamp> {
    return await this.bootcampsService.createBootcamp(createBootcamp);
  }

  @ApiOperation({
    summary: `Delete bootcamp by Id`,
  })
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async deleteBootcamp(@Param() id: GetBootcamp): Promise<void> {
    return this.bootcampsService.deleteBootcamp(id);
  }

  @ApiOperation({
    summary: `Update bootcamp by Id`,
  })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateBootcamp(
    @Body() createBootcamp: UpdateBootcamp,
    @Param() id: GetBootcamp,
  ): Promise<Bootcamp> {
    return this.bootcampsService.updateBootcamp(id, createBootcamp);
  }
}
