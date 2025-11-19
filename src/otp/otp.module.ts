import { forwardRef, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_otp } from './entity/otp.entity';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([User_otp]),EmailModule,forwardRef(()=>AuthModule),RedisModule,UsersModule],
  providers: [OtpService],
  exports:[OtpService]
})
export class OtpModule {}
