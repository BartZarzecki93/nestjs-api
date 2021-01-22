import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { CreateBootcamp, GetBootcamp } from './dto/bootcamp';
import { Bootcamp } from './model/Bootcamp';

@ApiTags('Bootcamps')
@Controller('bootcamps')
export class BootcampsController {
  constructor(private bootcampsService: BootcampsService) {}

  @ApiOperation({
    description: `Get all bootcamps`,
  })
  @Get()
  async getAllBootcamps(): Promise<Bootcamp[]> {
    return await this.bootcampsService.getBootcamps();
  }

  @ApiOperation({
    description: `Get bootcamp by Id`,
  })
  @Get(':id')
  async getBootcamp(@Param() id: GetBootcamp): Promise<Bootcamp> {
    return await this.bootcampsService.getBootcamp(id);
  }

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

  @Delete(':id')
  async deleteBootcamp(@Param() id: GetBootcamp): Promise<void> {
    return this.bootcampsService.deleteBootcamp(id);
  }

  @Patch(':id')
  async updateBootcamp(
    @Body() createBootcamp: CreateBootcamp,
    @Param() id: GetBootcamp,
  ): Promise<Bootcamp> {
    return this.bootcampsService.updateBootcamp(id, createBootcamp);
  }
}
