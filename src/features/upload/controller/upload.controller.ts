import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../validation/multer.config';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/features/auth/decorators/current-user.decorator';
import { User } from 'src/features/user/schema/user.schema';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get()
  async getFile() {
    const result = await this.uploadService.handleGetFiles();
    return { data: result };
  }

  @Post()
  @UseGuards(JwtAuthGuard) // cần token hay không
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body() body: { folder?: string },
  ) {
    const result = await this.uploadService.handleUpload(
      file,
      user,
      body.folder,
    );
    console.log(body);
    // xóa file sau khi upload lên cloudinary
    fs.unlinkSync(file.path);
    return { url: result.url };
  }
}
