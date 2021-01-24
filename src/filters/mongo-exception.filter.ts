import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';

import * as MongooseError from 'mongoose/lib/error'; // I couldn't see the error class is being exported from Mongoose

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError) {
    let newError;

    console.log(exception);
    switch (exception.name) {
      // case 'DocumentNotFoundError': { break; }
      // case 'MongooseError': { break; } // general Mongoose error
      // case 'CastError': { break; }
      // case 'DisconnectedError': { break; }
      // case 'DivergentArrayError': { break; }
      // case 'MissingSchemaError': { break; }
      // case 'ValidatorError': { break; }
      case 'ValidationError': {
        newError = new BadRequestException(exception.name);
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

    throw newError;
  }
}
