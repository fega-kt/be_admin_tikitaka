import { User } from './../../user/schema/user.schema';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { STATUS } from 'src/constants/status';
import { ObjectId } from 'src/shared/mongoose/object-id';

@Schema()
export class Upload extends Document {
  @Prop()
  asset_id: string;

  @Prop()
  public_id: string;

  @Prop()
  version: number;

  @Prop()
  signature: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  format: string;

  @Prop()
  tags: string[];

  @Prop()
  bytes: number;

  @Prop()
  etag: string;

  @Prop()
  placeholder: boolean;

  @Prop()
  url: string;

  @Prop()
  secure_url: string;

  @Prop()
  folder: string;

  @Prop()
  original_filename: string;

  @Prop({ default: () => STATUS.ACTIVE })
  status: number;

  @Prop({ type: ObjectId, ref: User.name })
  owner: User;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date(), index: true })
  updatedAt: Date;
}

export const UploadSchema = createSchemaForClassWithMethods(Upload);
