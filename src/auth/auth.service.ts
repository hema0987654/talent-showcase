import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create_user';
export interface JwtPayload {
    sub: number;
    email: string;
    role: string;
}
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtservice: JwtService,
    ) { }

    async login(info: LoginDto) {
        try {
            const findUser = await this.userService.validatePassword(info.email, info.password);
            console.log(findUser);

            const payload: JwtPayload = { sub: findUser.id, email: findUser.email, role: findUser.role };
            const token = this.jwtservice.sign(payload)
            return {
                user: {
                    id: findUser.id,
                    email: findUser.email,
                    firstName: findUser.first_name,
                    lastName: findUser.last_name,
                    role: findUser.role,
                }, token
            };
        } catch (error) {
            throw new HttpException(
                `Failed to login: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async register(info: CreateUserDto) {
        try {
            const user = await this.userService.create(info);
            const payload: JwtPayload = { sub: user.data.id, email: user.data.email, role: user.data.role };
            const token = this.jwtservice.sign(payload);
            return {
                user
                ,
                token
            };
        } catch (error) {
            throw new HttpException(
                `Failed to register : ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

