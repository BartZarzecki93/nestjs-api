import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Token } from 'src/database/schemas/token';
import { User } from '../database/schemas/user';
import { AuthService } from './auth.service';
import { CreateUser } from './dto/register.dto';
import { LoginUser } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  private logger = new Logger('Auth');
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  @UsePipes(ValidationPipe)
  async register(@Args('registerUser') registerUser: CreateUser) {
    this.logger.verbose(`Registration of the user with ${registerUser.email}`);
    return this.authService.register(registerUser);
  }

  @Mutation(() => Token)
  @UsePipes(ValidationPipe)
  async login(@Args('loginUser') loginUser: LoginUser) {
    this.logger.verbose(`Login of the user with ${loginUser.email}`);
    return this.authService.login(loginUser);
  }
}
