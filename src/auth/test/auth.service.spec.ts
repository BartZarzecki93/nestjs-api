import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { TestDatabaseModule } from '../../../test/test-database.module';
import { User, UserSchema } from '../../database/schemas/user';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection } from '../../../test/test-database.providers';
import { CreateUser } from '../dto/register.dto';
import { Role } from '../../database/enums/user.enum';
import { AuthResolver } from '../auth.resolver';
import { JwtStrategy } from '../jwt.strategy';
import * as configuration from 'config';
import { JwtModule } from '@nestjs/jwt';
import { LoginUser } from '../dto/login.dto';

const jwtConfig = configuration.get('jwt');
describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET || jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [AuthService, JwtStrategy, AuthResolver],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return new user', async () => {
    const newUser = await service.register(userCreate);
    console.log(newUser);
    expect(newUser.password).not.toBe(userCreate.password);
  });

  it('should not return new user', async () => {
    await expect(service.register(userWrongEmail)).rejects.toThrow();
  });

  it('should login', async () => {
    const token = await service.login(userLogin);
    expect(token.accessToken).toBeTruthy();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});

const userCreate: CreateUser = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123f@02.pl',
  role: Role.USER,
};

const userLogin: LoginUser = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123f@02.pl',
};

const userWrongEmail: CreateUser = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123f@02.pl',
  role: Role.USER,
};
