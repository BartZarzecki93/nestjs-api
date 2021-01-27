import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Length,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Skill } from '../../database/enums/skill.enum';

@InputType()
export class CreateCourse {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 50)
  @Field(() => String)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 500)
  @Field(() => String)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  weeks: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  tuition: number;

  @ApiProperty()
  @IsEnum(Skill)
  @Field(() => Skill)
  minimumSkill: Skill;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  scholarshipAvailable: boolean;
}
