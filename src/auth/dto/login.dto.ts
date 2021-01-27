import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;
}
