import { AuthService } from './auth.service';
import { User } from '../database/schemas/user';
import { UserCreate, UserLogin } from './dto/auth.dto';
import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

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
  async register(@Body() createUser: UserCreate): Promise<User> {
    this.logger.verbose(
      `Registration of the user with ${JSON.stringify(createUser.email)}`,
    );
    return await this.authService.register(createUser);
  }

  @ApiOperation({
    summary: `Login the user`,
  })
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginUser: UserLogin): Promise<{ accessToken: string }> {
    this.logger.verbose(
      `Login of the user with ${JSON.stringify(loginUser.email)}`,
    );
    return await this.authService.login(loginUser);
  }
}
