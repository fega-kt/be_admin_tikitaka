import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';

@Schema()
export class Upload extends Document {
  @Prop({
    required: true,
  })
  title: string;
}

export const UploadSchema = createSchemaForClassWithMethods(Upload);
