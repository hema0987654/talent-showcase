import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create_user';
import { LoginDto } from './dto/login.dto';
import { OtpService } from 'src/otp/otp.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly otpService: OtpService
    ) {}

    @Post('register')
    async register(@Body() info: CreateUserDto) {
        return this.otpService.sendOtp(info);
    }

    @Post('verify')
    async verify(@Body() body: { email: string; otp: string }) {
        return this.otpService.verifyOtp(body.email, body.otp);
    }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }
}
