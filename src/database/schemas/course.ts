import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Careers } from '../enums/bootcamp.enum';
import { Skill } from '../enums/skill.enum';

@ObjectType()
@Schema({
  timestamps: true,
})
export class Course extends Document {
  @ApiProperty({
    type: Types.ObjectId,
  })
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: [true, 'Please add a name'],
    index: {
      unique: 'Two bootcamps cannot share the same name',
    },
    maxlength: [50, 'Name can not be more than 50 characters'],
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  title: string;

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
    type: Number,
  })
  @ApiProperty({
    type: Number,
  })
  @Field(() => Number)
  weeks: number;

  @Prop({
    type: Number,
  })
  @ApiProperty({
    type: Number,
  })
  @Field(() => Number)
  tuition: number;

  @Prop({
    type: String,
    required: [true],
    enum: Skill,
  })
  @ApiProperty({
    type: String,
  })
  @Field(() => Skill)
  minimumSkill: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @Field(() => Boolean)
  scholarshipAvailable: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Bootcamp', required: true })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  bootcamp: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({
    type: String,
  })
  @Field(() => String)
  user: Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
