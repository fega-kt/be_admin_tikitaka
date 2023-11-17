import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../validation/multer.config';
import * as fs from 'fs';

@Controller('uploads')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.handleUpload(file);
    // xóa file sau khi upload lên cloudinary
    fs.unlinkSync(file.path);
    return { url: result, path: file.path };
  }
}
