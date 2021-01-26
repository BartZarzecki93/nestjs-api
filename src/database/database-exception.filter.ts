import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import * as MongooseError from 'mongoose/lib/error'; // I couldn't see the error class is being exported from Mongoose
import { ValidationError } from '@nestjs/common';

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  private logger = new Logger('Bootcamps');

  catch(exception: MongooseError) {
    let newError;

    switch (exception.name) {
      // case 'DocumentNotFoundError': { break; }
      // case 'MongooseError': { break; } // general Mongoose error
      // case 'CastError': { break; }
      // case 'DisconnectedError': { break; }
      // case 'DivergentArrayError': { break; }
      // case 'MissingSchemaError': { break; }
      // case 'ValidatorError': { break; }
      case 'ValidationError': {
        newError = new ConflictException(
          exception.errors[Object.keys(exception.errors)[0]].properties.message,
        );
        break;
      }
      // case 'ObjectExpectedError': { break; }
      // case 'ObjectParameterError': { break; }
      // case 'OverwriteModelError': { break; }
      // case 'ParallelSaveError': { break; }
      // case 'StrictModeError': { break; }
      // case 'VersionError': { break; }
      default: {
        newError = new InternalServerErrorException(exception.name);
        break;
      }
    }
    this.logger.error(`Mongo ${exception.name}`);
    throw newError;
  }
}
