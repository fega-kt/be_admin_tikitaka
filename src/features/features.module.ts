import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationModule } from './notification/notification.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoomModule,
    MessagesModule,
    NotificationModule,
    UploadModule,
  ],
  controllers: [],
  exports: [
    AuthModule,
    UserModule,
    RoomModule,
    MessagesModule,
    NotificationModule,
    UploadModule,
  ],
})
export class FeaturesModule {}
