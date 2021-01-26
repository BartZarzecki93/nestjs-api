import { MongooseModule } from '@nestjs/mongoose';
import { BootcampSchemaProvider } from 'src/database/providers/bootcamp.provider';
import { UserSchemaProvider } from './providers/user.provider';

export const databaseProvider = MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: 'mongodb://localhost:27017/dev-camps-test',
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }),
});

export const databaseFeature = MongooseModule.forFeatureAsync([
  BootcampSchemaProvider,
  UserSchemaProvider,
]);
