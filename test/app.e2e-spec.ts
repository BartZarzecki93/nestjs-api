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
