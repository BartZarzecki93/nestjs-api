import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Token } from 'src/database/schemas/token';
import { User } from '../database/schemas/user';
import { AuthService } from './auth.service';
import { UserCreate, UserLogin } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  @UsePipes(ValidationPipe)
  async register(@Args('registerUser') registerUser: UserCreate) {
    return this.authService.register(registerUser);
  }

  @Mutation(() => Token)
  @UsePipes(ValidationPipe)
  async login(@Args('loginUser') loginUser: UserLogin) {
    return this.authService.login(loginUser);
  }
}
