import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { cloudinaryConfig } from '../validation/cloudinary.config';
import { Upload } from '../schema/upload.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/features/user/schema/user.schema';

@Injectable()
export class UploadService {
  constructor(@InjectModel(Upload.name) private uploadModel: Model<Upload>) {}
  async handleUpload(
    file: Express.Multer.File,
    user: User,
    folder = 'tikitaka',
    resource_type?: UploadApiOptions['resource_type'],
  ) {
    let result: any;
    try {
      cloudinary.config(cloudinaryConfig);
      result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: resource_type,
      });
      result.owner = user._id;
      await this.uploadModel.create(result);
      return result;
    } catch (error) {
      if (result && result.public_id) {
        this.handleDeleteFileCloudiary([result.public_id]);
      }
      return { error };
    }
  }
  async handleDeleteFileCloudiary(ids: string[]) {
    try {
      cloudinary.config(cloudinaryConfig);
      await cloudinary.api.delete_resources(ids, {
        invalidate: true,
      });
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
