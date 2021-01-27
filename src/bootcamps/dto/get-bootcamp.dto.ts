import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetBootcamp {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  id: string;
}
