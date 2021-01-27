import { registerEnumType } from '@nestjs/graphql';

export enum Skill {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

registerEnumType(Skill, {
  name: 'Careers',
  description: 'The supported careers.',
});
