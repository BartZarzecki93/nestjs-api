import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsUrl,
  Length,
} from 'class-validator';
import { Careers } from '../../database/enums/bootcamp.enum';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBootcamp {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 50)
  @Field(() => String)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 500)
  @Field(() => String)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 500)
  @IsUrl()
  @Field(() => String)
  website: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Field(() => String)
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Field(() => String)
  address: string;

  @ApiProperty()
  @IsEnum(Careers)
  @Field(() => Careers)
  careers: Careers;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  housing: boolean;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  jobAssistance: boolean;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  jobGuarantee: boolean;

  @ApiProperty()
  @IsBoolean()
  @Field(() => Boolean)
  acceptGi: boolean;
}
