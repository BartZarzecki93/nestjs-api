import { Global, Module } from '@nestjs/common';
import {
  rootMongooseTestModule,
  featureMongooseTestModule,
  gqlTestModule,
} from './test-database.providers';

@Global()
@Module({
  imports: [rootMongooseTestModule, featureMongooseTestModule, gqlTestModule],
  providers: [],
  exports: [],
})
export class TestDatabaseModule {}
