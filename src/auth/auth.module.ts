import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [ConfigModule, UsersModule,forwardRef(()=>OtpModule), PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<any> => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any },
    }),
  })],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
