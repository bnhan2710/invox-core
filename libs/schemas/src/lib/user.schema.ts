import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends BaseSchema {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, unique: true })
  email: string;

  // generate from Keycloak
  @Prop({ type: String, unique: true })
  userId: string;

  @Prop({ type: [{ type: ObjectId, ref: 'Role' }] })
  roles: ObjectId[];
}

export const UserModelName = User.name;

export const UserSchema = createSchema(User);

export type UserModel = Model<User>;

export const UserDestination = {
  name: UserModelName,
  schema: UserSchema,
};
