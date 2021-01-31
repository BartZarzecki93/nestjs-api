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
import { MongoExceptionFilter } from '../../database/filters/exception.filter';

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
    expect(newUser).toBeTruthy();
    expect(newUser.email).toBe(userCreate.email);
    expect(newUser.password).not.toBe(userCreate.password);
  });

  it('should not return new user (wrong email)', async () => {
    service.register(userWrongEmail).catch((e) => {
      const message = e.errors[Object.keys(e.errors)[0]].properties.message;
      expect(message).toBe('Please add a valid email');
    });
  });

  it('should not return new user (the same email)', async () => {
    service.register(userCreate).catch((e) => {
      const message = e.errors[Object.keys(e.errors)[0]].properties.message;
      expect(message).toBe('Two users cannot share the same username');
    });
  });

  it('should not return new user (no password)', async () => {
    service.register(userNoPassword).catch((e) => {
      const message = e.errors[Object.keys(e.errors)[0]].properties.message;
      expect(message).toBe('Please add a password');
    });
  });

  it('should not return new user (short password)', async () => {
    service.register(userShortPassword).catch((e) => {
      const message = e.errors[Object.keys(e.errors)[0]].properties.message;
      expect(message).toBe('Password can not be less than 4 characters');
    });
  });
  it('should not login (wrong email)', async () => {
    service.login(userWrongLogin).catch((e) => {
      expect(e.message).toBe('Invalid credentials');
      expect(e.status).toBe(401);
    });
  });

  it('should not login (wrong password)', async () => {
    service.login(userWrongPass).catch((e) => {
      expect(e.message).toBe('Invalid credentials');
      expect(e.status).toBe(401);
    });
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

const userWrongLogin: LoginUser = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123@02.pl',
};

const userWrongPass: LoginUser = {
  password: 'Swimzaerz1$',
  email: '4dggsfs123f@02.pl',
};

const userWrongEmail: CreateUser = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123',
  role: Role.USER,
};

const userNoPassword: CreateUser = {
  password: '',
  email: '4dggsfs123',
  role: Role.USER,
};

const userShortPassword: CreateUser = {
  password: '123',
  email: '4dggsfs123',
  role: Role.USER,
};
