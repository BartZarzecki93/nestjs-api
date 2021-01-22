import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBootcamp {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 500)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 500)
  description: string;
}

export class GetBootcamp {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
