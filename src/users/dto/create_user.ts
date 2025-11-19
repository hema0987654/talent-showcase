import {
    IsNotEmpty,
    IsEmail,
    IsEnum,
    IsString,
    Length,
    Matches,
    IsOptional,
    IsBoolean
} from "class-validator";
import { Transform } from 'class-transformer';
import { UserRole } from "../Entity/user.entity";

export class CreateUserDto {
    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    @Length(2, 50, { message: 'First name must be between 2 and 50 characters long' })
    @Transform(({ value }) => value?.trim())
    first_name: string;

    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    @Length(2, 50, { message: 'Last name must be between 2 and 50 characters long' })
    @Transform(({ value }) => value?.trim())
    last_name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email address' })
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
        message: 'Password must contain upper, lower, number, and special character',
    })

    @Length(8, 100, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsEnum(UserRole, { message: 'Role must be either admin, artist, or buyer' })
    @IsOptional()
    role?: UserRole;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean
}
