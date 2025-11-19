import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDto } from './create-work.dto';
import { IsOptional } from 'class-validator';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {
    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    price?: number;
}
