import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  Length,
} from 'class-validator';
import { Careers } from '../../database/enums/bootcamp.enum';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBootcamp {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 50)
  @IsOptional()
  @Field(() => String, { nullable: true })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 500)
  @IsOptional()
  @Field(() => String, { nullable: true })
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 500)
  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  website: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  @Field(() => String, { nullable: true })
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  @Field(() => String, { nullable: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Field(() => String, { nullable: true })
  address: string;

  @ApiProperty()
  @IsEnum(Careers)
  @IsOptional()
  @Field(() => Careers, { nullable: true })
  careers: Careers;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  housing: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  jobAssistance: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  jobGuarantee: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  acceptGi: boolean;
}
