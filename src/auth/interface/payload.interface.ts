import { Types } from 'mongoose';
import { Role } from 'src/database/enums/user.enum';

export interface Payload {
  _id: Types.ObjectId;
  email: string;
  role: Role[];
}
