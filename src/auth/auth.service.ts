import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../database/schemas/user';
import { CreateUser } from './dto/register.dto';
import { LoginUser } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interface/payload.interface';
import { Token } from '../database/schemas/token';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUser: CreateUser): Promise<User> {
    const userNew = this.userModel.create(createUser);

    return userNew;
  }

  async login(loginUser: LoginUser): Promise<Token> {
    const { email, password } = loginUser;

    const user = await this.userModel
      .findOne({
        email: email,
      })
      .select('+password');

    if (!user) {
      this.logger.error(`Invalid credentials`);
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const isMatch = await user.comparePassword(password, user.password);

    if (!isMatch) {
      this.logger.error(`Invalid credentials`);
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const payload: Payload = {
      _id: user.id,
      role: user.role,
      email: user.email,
    };
    const accessToken = await this.jwtService.sign(payload);

    const token: Token = { accessToken };
    return token;
  }
}
