import * as bcrypt from 'bcrypt';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { randomString } from '../../../shared/utils/random-string';
import { STATUS } from 'src/shared/constants/status';
import { IsEnum } from 'class-validator';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  sessionToken: string;

  @Prop({ default: false })
  online: boolean;

  @Prop({ default: false })
  admin: boolean;

  @Prop()
  password?: string;

  @Prop()
  facebookId?: string;

  @Prop()
  googleId?: string;

  @Prop()
  appleId?: string;

  @Prop({ default: STATUS.ACTIVE })
  status: number;
  @IsEnum(STATUS)
  get isSocial(): boolean {
    return !!(this.facebookId || this.googleId || this.appleId);
  }

  generateSessionToken() {
    this.sessionToken = randomString(60);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password || '');
  }
}

export const UserSchema = createSchemaForClassWithMethods(User);

// Update password into a hashed one.
UserSchema.pre('save', async function(next) {
  const user: User = this as any;

  if (!user.password || user.password.startsWith('$')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (e) {
    next(e);
  }
});
