import { Test, TestingModule } from '@nestjs/testing';
import {
  ValidationError,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';

import { CoursesModule } from '../src/courses/courses.module';
import { AuthModule } from '../src/auth/auth.module';
import { BootcampsModule } from '../src/bootcamps/bootcamps.module';
import { TestDatabaseModule } from './test-database.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { MongoExceptionFilter } from '../src/database/filters/exception.filter';
import { Role } from '../src/database/enums/user.enum';
import { CreateUser } from '../src/auth/dto/register.dto';
import { closeInMongodConnection } from './test-database.providers';
import { LoginUser } from '../src/auth/dto/login.dto';

describe('AppController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const fastifyAdapter = new FastifyAdapter();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, BootcampsModule, AuthModule, CoursesModule],
    }).compile();

    app = moduleFixture.createNestApplication(fastifyAdapter);
    app.useGlobalFilters(new MongoExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new BadRequestException(
            validationErrors.map((m) => m.constraints),
          );
        },
      }),
    );
    await app.init();
  });

  it('AUTH/register should register a user', () => {
    return app
      .inject({
        method: 'POST',
        url: 'auth/register',
        payload: user,
      })
      .then((out: any) => {
        const statusCode = out.statusCode;
        const payload = JSON.parse(out.payload);
        expect(statusCode).toEqual(201);
        expect(payload.email).toEqual(user.email);
        expect(payload.role).toEqual([Role.USER]);
      });
  });

  it('AUTH/register should not register a user with the same email', () => {
    return app
      .inject({
        method: 'POST',
        url: 'auth/register',
        payload: user,
      })
      .then((out: any) => {
        const statusCode = out.statusCode;
        const payload = JSON.parse(out.payload);

        expect(statusCode).toEqual(409);
        expect(payload.error).toEqual('Conflict');
        expect(payload.message).toEqual(
          'Two users cannot share the same username',
        );
      });
  });

  it('AUTH/register should not register a user with bad email', () => {
    return app
      .inject({
        method: 'POST',
        url: 'auth/register',
        payload: userBadEmail,
      })
      .then((out: any) => {
        const statusCode = out.statusCode;
        const payload = JSON.parse(out.payload);

        expect(statusCode).toEqual(400);
        expect(payload.error).toEqual('Bad Request');
        expect(payload.message[0].isEmail).toEqual('email must be an email');
      });
  });

  it('AUTH/register should not register a user with weak password', () => {
    return app
      .inject({
        method: 'POST',
        url: 'auth/register',
        payload: userWeakPass,
      })
      .then((out: any) => {
        const statusCode = out.statusCode;
        const payload = JSON.parse(out.payload);

        expect(statusCode).toEqual(400);
        expect(payload.error).toEqual('Bad Request');
        expect(payload.message[0].matches).toEqual('Password is too weak ');
      });
  });

  it('AUTH/login', () => {
    return app
      .inject({
        method: 'POST',
        url: 'auth/login',
        payload: userLogin,
      })
      .then((out: any) => {
        const statusCode = out.statusCode;
        const payload = JSON.parse(out.payload);
        expect(statusCode).toEqual(201);
        expect(payload.accessToken).toBeTruthy();
      });
  });

  it('AUTH/login should not log in with wrong pass', () => {
    return app
      .inject({
        method: 'POST',
        url: 'auth/login',
        payload: userWrongPass,
      })
      .then((out: any) => {
        const statusCode = out.statusCode;
        const payload = JSON.parse(out.payload);
        expect(statusCode).toEqual(401);
        expect(payload.message).toBe('Invalid credentials');
      });
  });

  it('AUTH/login should not log in with wrong email', () => {
    return app
      .inject({
        method: 'POST',
        url: 'auth/login',
        payload: userWrongEmail,
      })
      .then((out: any) => {
        const statusCode = out.statusCode;
        const payload = JSON.parse(out.payload);
        expect(statusCode).toEqual(401);
        expect(payload.message).toBe('Invalid credentials');
      });
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });
});

const user: CreateUser = {
  password: 'Swim123zarzdec12$',
  email: '4dggsfs123f@o2.pl',
  role: Role.USER,
};

const userLogin: LoginUser = {
  password: 'Swim123zarzdec12$',
  email: '4dggsfs123f@o2.pl',
};

const userWrongPass: LoginUser = {
  password: 'Swim123zarzdec',
  email: '4dggsfs123f@o2.pl',
};

const userWrongEmail: LoginUser = {
  password: 'Swim123zarzdec12$',
  email: '4dggs123f@o2.pl',
};

const userBadEmail: CreateUser = {
  password: 'Swimzaerz12$',
  email: '4dggsfs123',
  role: Role.USER,
};

const userWeakPass: CreateUser = {
  password: 'swimz',
  email: '4dggssdfsdfs123@o2.pl',
  role: Role.USER,
};
