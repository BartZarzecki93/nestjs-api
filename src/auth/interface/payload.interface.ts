import { Types } from 'mongoose';
import { Role } from '../../database/enums/user.enum';

export interface Payload {
  _id: Types.ObjectId;
  email: string;
  role: Role[];
}
