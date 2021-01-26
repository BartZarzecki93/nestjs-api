import { Global, Module } from '@nestjs/common';
import { databaseFeature, databaseProvider } from './database.provider';

@Global()
@Module({
  imports: [databaseProvider, databaseFeature],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
