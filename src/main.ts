import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MongoExceptionFilter } from './database/database-exception.filter';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as helmet from 'fastify-helmet';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  app.register(helmet.fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
        ],
        fontSrc: [`'self'`, 'fonts.gstatic.com'],
        imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
      },
    },
  });

  //Using swagger docs
  const config = new DocumentBuilder()
    .setTitle('Dev camps API')
    .setDescription(
      'Fully  working API for dev camps (Fastify, Nestjs, GraphQl, Mongo)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //applying mongo exceptions filters
  app.useGlobalFilters(new MongoExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        logger.error(`ValidationPipe Error`);

        return new BadRequestException(
          validationErrors.map((m) => m.constraints),
        );
      },
    }),
  );

  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
