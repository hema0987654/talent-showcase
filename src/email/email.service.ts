import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('email.host'),
            port: Number(this.configService.get<number | string>('email.port')),
            secure: this.configService.get<boolean>('email.secure'),
            auth: {
                user: this.configService.get<string>('email.user'),
                pass: this.configService.get<string>('email.pass'),
            },
        });
    }

async sendOtp(to: string, otp: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
