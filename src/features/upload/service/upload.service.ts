import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../validation/cloudinary.config';

@Injectable()
export class UploadService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
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
      console.log(111111, error);

      return { error };
    }
  }
}
