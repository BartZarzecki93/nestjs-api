import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '../enums/user.enum';

@ObjectType()
@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty({
    type: Types.ObjectId,
  })
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    required: [true, 'Please add a email'],
    index: {
      unique: 'Two users cannot share the same username',
    },
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  email: string;

  @Prop({
    type: String,
    required: [true],
    enum: Role,
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => Role)
  role: string;

  @Prop({
    type: String,
    required: [true, 'Please add a password'],
    select: false,
    minlength: [6, 'Password can not be less than 4 characters'],
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
