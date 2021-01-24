//import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Careers } from './bootcamp.enum';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema({
  timestamps: true,
})
export class Bootcamp extends Document {
  @ApiProperty({
    type: Types.ObjectId,
  })
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
    minlength: [4, 'Name can not be less than 4 characters'],
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  slug: string;

  @Prop({
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters'],
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  description: string;

  @Prop({
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS',
    ],
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  website: string;

  @Prop({
    type: String,
    maxlength: [
      20,
      'Phone number need an area code and can not be longer than 20 characters',
    ],
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  phone: string;

  @Prop({
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  email: string;

  @Prop({ type: String, required: [true, 'Please add an address'] })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  address: string;

  // @Prop()
  // @ApiProperty({
  //   type: String,
  // })
  // location: {
  //   type: string;
  //   enum: ['Point'];
  // };

  @Prop({
    type: String,
    required: [true],
    enum: Careers,
  })
  @ApiProperty({
    type: String,
  })
  @Field((type) => Careers)
  careers: string;

  @Prop({
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10'],
  })
  @ApiProperty({
    type: Number,
  })
  @Field(() => Number)
  averageRating: number;

  @Prop({
    type: Number,
  })
  @ApiProperty({
    type: Number,
  })
  @Field(() => Number)
  averageCost: number;

  @Prop({
    type: String,
    default: 'no-photo.jpg',
  })
  @ApiProperty({
    type: String,
    default: 'no-photo.jpg',
  })
  @Field(() => String)
  photo: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @Field(() => Boolean)
  housing: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @Field(() => Boolean)
  jobAssistance: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @Field(() => Boolean)
  jobGuarantee: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @Field(() => Boolean)
  acceptGi: boolean;
}

export const BootcampSchema = SchemaFactory.createForClass(Bootcamp);
