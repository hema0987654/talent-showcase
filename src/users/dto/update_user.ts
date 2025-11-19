import{PartialType} from '@nestjs/mapped-types';

import { CreateUserDto } from './create_user';
export class UpdateUserDto extends PartialType(CreateUserDto) {
    role?: never;
    email?: never;
}