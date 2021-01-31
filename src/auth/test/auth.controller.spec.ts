import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { TestDatabaseModule } from '../../../test/test-database.module';
import { User, UserSchema } from '../../database/schemas/user';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection } from '../../../test/test-database.providers';
import { Role } from '../../database/enums/user.enum';
import { AuthResolver } from '../auth.resolver';
import { JwtStrategy } from '../jwt.strategy';
import * as configuration from 'config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../auth.controller';
import { PassportModule } from '@nestjs/passport';

const jwtConfig = configuration.get('jwt');
describe('AuthService', () => {
  let controller: AuthController;
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
        PassportModule.register({ defaultStrategy: 'jwt' }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, AuthResolver],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return new user', async () => {
    const newUser = await controller.register(userCreate);
    expect(newUser.password).not.toBe(userCreate.password);
  });

  it('should not return new user (same email)', async () => {
    try {
      await controller.register(userCreate);
    } catch (e) {
      const message = e.errors[Object.keys(e.errors)[0]].properties.message;
      expect(message).toBe('Two users cannot share the same username');
    }
  });

  it('should not return new user (wrong email)', async () => {
    try {
      await controller.register(userWrongEmail);
    } catch (e) {
      const message = e.errors[Object.keys(e.errors)[0]].properties.message;
      expect(message).toBe('Please add a valid email');
    }
  });

  it('should not return new user (short pass)', async () => {
    try {
      await controller.register(userShortPass);
    } catch (e) {
      const message = e.errors[Object.keys(e.errors)[0]].properties.message;
      expect(message).toBe('Please add a valid email');
    }
  });

  it('should login', async () => {
    const token = await controller.login(userLogin);
    expect(token.accessToken).toBeTruthy();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});

const userCreate = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123f@02.pl',
  role: Role.USER,
};

const userLogin = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123f@02.pl',
};

const userWrongEmail = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123f@',
  role: Role.USER,
};

const userShortPass = {
  password: 'swimzaer',
  email: '4dggsfs123f@kk.pl',
  role: Role.USER,
};
