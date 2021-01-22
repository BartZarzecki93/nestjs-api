//import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Bootcamp extends Document {
  // @ApiProperty({
  //   type: Types.ObjectId,
  // })
  // _id!: Types.ObjectId;

  @Prop({
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  })
  @ApiProperty({
    type: String,
  })
  name!: string;

  @Prop()
  @ApiProperty({
    type: String,
  })
  slug!: string;

  @Prop({
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters'],
  })
  @ApiProperty({
    type: String,
  })
  description!: string;
}

export const BootcampSchema = SchemaFactory.createForClass(Bootcamp);
