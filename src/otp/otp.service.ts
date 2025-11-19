import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { addMinutes } from 'date-fns';
import { EmailService } from 'src/email/email.service';
import { User_otp } from './entity/otp.entity';
import { CreateUserDto } from 'src/users/dto/create_user';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(User_otp)
        private readonly OtpRepository: Repository<User_otp>,
        private readonly emailService: EmailService,
        private readonly authservuce: AuthService,
        private readonly userSerivc: UsersService,
        @Inject('REDIS_CLIENT') private readonly redis: Redis) { }

    async sendOtp(info: CreateUserDto) {

        const findUSer = await this.OtpRepository.findOneBy({ email: info.email });
        if (findUSer) {
            await this.OtpRepository.remove(findUSer);
        }

        const user = this.OtpRepository.create(info);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpHash = await bcrypt.hash(otp, 10);

        user.otp = otpHash;
        user.otp_expires_at = addMinutes(new Date(), 5);

        await this.OtpRepository.save(user);

        await this.emailService.sendOtp(info.email, otp);

        return { message: 'OTP sent successfully' };
    }

    async verifyOtp(email: string, otp: string) {
        const findUSer = await this.OtpRepository.findOne({
            where: { email },
            select: ['id', 'email', 'avatar_url', 'otp', 'otp_expires_at', 'first_name', 'last_name', 'role', 'password']
        });

        if (!findUSer || !findUSer.otp || !findUSer.otp_expires_at || findUSer.otp_expires_at < new Date()) {
            throw new BadRequestException('OTP expired or not found');
        }

        const attempts = await this.userSerivc.increaseLoginAttempts(email)

        if (+attempts > 5) {
            throw new BadRequestException('Too many OTP attempts. Try again later.');
        }

        const isValid = await bcrypt.compare(otp, findUSer.otp);
        if (!isValid) throw new BadRequestException('Invalid OTP');

        const user = await this.authservuce.register({
            first_name: findUSer.first_name,
            last_name: findUSer.last_name,
            email: findUSer.email,
            password: findUSer.password,
            role: findUSer.role,
            avatar_url: findUSer.avatar_url,
            is_active: true
        })

        await this.OtpRepository.remove(findUSer);
        await this.redis.del(`otp_attempts_${email}`);


        return {
            user,
            message: "Account verified successfully"
        };
    }
}
