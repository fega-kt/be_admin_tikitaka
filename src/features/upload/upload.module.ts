import { UploadService } from './service/upload.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadController } from './controller/upload.controller';
import { SharedModule } from 'src/shared/shared.module';
import { Upload, UploadSchema } from './schema/upload.schema';
import { AuthService } from '../auth/service/auth.service';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Upload.name,
        schema: UploadSchema,
      },
    ]),
    SharedModule,
    AuthModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, AuthService],
  exports: [UploadService, AuthService],
})
export class UploadModule {}
