import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Role } from '../../database/enums/user.enum';

@InputType()
export class CreateUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password is too weak `,
  })
  @Field(() => String)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role)
  @Field(() => Role)
  role: Role;
}
