import { FeaturesModule } from './features/features.module';
import { CoreModule } from './core/core.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ExceptionsFilter } from './core/filter/exceptions.filter';
import { environments } from './environments/environments';
import { TransformInterceptor } from './transform.interceptor';
@Module({
  imports: [
    FeaturesModule,
    CoreModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(environments.mongoUri, {
      autoIndex: false,
      useFindAndModify: false,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
