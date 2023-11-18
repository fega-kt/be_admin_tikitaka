import { UploadModule } from './../upload.module';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../validation/cloudinary.config';
import { Upload } from '../schema/upload.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UploadService {
  constructor(@InjectModel(Upload.name) private uploadModel: Model<Upload>) {}
  async handleUpload(file: Express.Multer.File) {
    try {
      cloudinary.config(cloudinaryConfig);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: '',
        // resource_type: 'image',
        resource_type: 'raw',
      });
      return result;
    } catch (error) {
      return { error };
    }
  }

  async handleGetFiles() {
    try {
      return await this.uploadModel.find();
    } catch (error) {
      console.log(111111, error);
      return { error };
    }
  }
}
