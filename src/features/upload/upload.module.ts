import { UploadService } from './service/upload.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadController } from './controller/upload.controller';
import { SharedModule } from 'src/shared/shared.module';
import { Upload, UploadSchema } from './schema/upload.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Upload.name,
        schema: UploadSchema,
      },
    ]),
    SharedModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
