import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCourse {
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
  @IsBoolean()
  @Field(() => Boolean)
  scholarshipAvailable: boolean;
}
