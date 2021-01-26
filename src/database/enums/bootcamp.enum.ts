import { registerEnumType } from '@nestjs/graphql';

export enum Careers {
  WEB_DEVELOPMENT = 'Web Development',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  UI_UX = 'UI/UX',
  DATA_SCIENCE = 'Data Science',
  BUSINESS = 'Business',
  OTHER = 'Other',
}

registerEnumType(Careers, {
  name: 'Careers',
  description: 'The supported careers.',
});
