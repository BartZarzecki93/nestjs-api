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
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Payload } from 'src/auth/interface/payload.interface';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/database/enums/user.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  private logger = new Logger('Bootcamps');
  constructor(
    private coursesService: CoursesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
}
