import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update_user';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
    ) { }

    async create(info: CreateUserDto) {
        try {
            const findUser = await this.usersRepository.findOneBy({ email: info.email });
            if (findUser) throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
            const password_hash = await bcrypt.hash(info.password, 10);
            const newUser = this.usersRepository.create({ ...info, password: password_hash });
            await this.usersRepository.save(newUser);
            return {
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role,
                    createdAt: newUser.created_at,
                    updatedAt: newUser.updated_at
                }
                , message: 'User created successfully'
            };
        } catch (error) {
            throw new HttpException(
                `Failed to create user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.usersRepository.findOneBy({ email });
            if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            return user;
        } catch (error) {
            throw new HttpException(
                `Failed to findByEmail user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findById(id: number) {
        try {
            const user = await this.usersRepository.findOneBy({ id });
            if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            return user;
        } catch (error) {
            throw new HttpException(
                `Failed to findById user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll() {
        try {
            return this.usersRepository.find();
        } catch (error) {
            throw new HttpException(
                `Failed to findAll user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async increaseLoginAttempts(email: string) {
        try {
            const key = `login_attempts_${email}`;
            const attempts = await this.redis.incr(key);

            if (attempts === 1) {
                await this.redis.expire(key, 60 * 15);
            }
        } catch (error) {
            throw new HttpException(
                `Failed to increaseLoginAttempts user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async validatePassword(email: string, password: string) {
        try {
            const key = `login_attempts_${email}`;
            const attempts = await this.redis.get(key);

            if (attempts && Number(attempts) >= 5) {
                throw new ForbiddenException('Too many login attempts. Try again after 15 minutes.');
            }

            const user = await this.usersRepository.findOne({
                where: { email },
                select: ['id', 'first_name', 'last_name', 'email', 'role', 'password']
            });

            if (!user) {
                await this.increaseLoginAttempts(email);
                throw new UnauthorizedException('Invalid credentials');
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                await this.increaseLoginAttempts(email);
                throw new UnauthorizedException('Invalid credentials');
            }

            await this.redis.del(key);

            return user;
        } catch (error) {
            throw new HttpException(
                `Failed to validatePassword user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    async update(id: number, info: UpdateUserDto) {
        try {
            if ('role' in info || 'email' in info) throw new BadRequestException('You cannot update email or role');
            const user = await this.findById(id);
            Object.assign(user, info);
            return this.usersRepository.save(user);
        } catch (error) {
            throw new HttpException(
                `Failed to update user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async delete(id: number) {
        try {
            const user = await this.findById(id);
            if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            return this.usersRepository.remove(user);
        } catch (error) {
            throw new HttpException(
                `Failed to delete user: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
