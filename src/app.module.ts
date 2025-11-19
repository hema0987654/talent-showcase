import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import databaseConfig from './config/DB.config';
import jwtConfig from './config/jwt.config';
import { OtpModule } from './otp/otp.module';
import { RedisModule } from './redis/redis.module';
import { WorksModule } from './works/works.module';
import { MediaModule } from './media/media.module';
import { UploadModule } from './upload/upload.module';
import { OrdersModule } from './orders/orders.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('Mongo_DB'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    OtpModule,
    EmailModule,
    NotificationsModule,
    RedisModule,
    WorksModule,
    MediaModule,
    UploadModule,
    OrdersModule,
    CommentsModule,
    CategoriesModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }



