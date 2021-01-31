import { Test, TestingModule } from '@nestjs/testing';
import {
  ValidationError,
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CoursesModule } from '../src/courses/courses.module';
import { DatabaseModule } from '../src/database/database.module';
import { AuthModule } from '../src/auth/auth.module';
import { BootcampsModule } from '../src/bootcamps/bootcamps.module';
import { TestDatabaseModule } from './test-database.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { MongoExceptionFilter } from '../src/database/filters/exception.filter';
import { Role } from '../src/database/enums/user.enum';
import { CreateUser } from '../src/auth/dto/register.dto';
import { closeInMongodConnection } from './test-database.providers';
import { LoginUser } from 'src/auth/dto/login.dto';

describe('AppController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const fastifyAdapter = new FastifyAdapter();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BootcampsModule, AuthModule, TestDatabaseModule, CoursesModule],
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
        console.log(payload);
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
        console.log(payload);
        expect(statusCode).toEqual(201);
        expect(payload.accessToken).toBeTruthy();
      });
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });
});
//using hashed password since current testing set up do not allow to use hooks
const user: CreateUser = {
  password: '$2a$10$WWvc4B3Y20ZyR43IiurXpOQvkVRgla5vV8XOLfAhbxa6Rd4sZl84O',
  email: '4dggsfs123f@o2.pl',
  role: Role.USER,
};

const userLogin: LoginUser = {
  password: 'Swim123zarzdec12$',
  email: '4dggsfs123f@o2.pl',
};
