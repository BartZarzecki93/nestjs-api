import { AuthService } from './auth.service';
import { User } from '../database/schemas/user';
import { CreateUser } from './dto/register.dto';
import { LoginUser } from './dto/login.dto';
import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Token } from 'src/database/schemas/token';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('Auth');

  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: `Register a user`,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() createUser: CreateUser): Promise<User> {
    this.logger.verbose(`Registration of the user with ${createUser.email}`);
    return await this.authService.register(createUser);
  }

  @ApiOperation({
    summary: `Login the user`,
  })
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginUser: LoginUser): Promise<Token> {
    this.logger.verbose(`Login of the user with ${loginUser.email}`);
    return await this.authService.login(loginUser);
  }
}
