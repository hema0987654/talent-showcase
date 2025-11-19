import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required and cannot be empty.' })
  @IsString({ message: 'Category name must be a valid string.' })
  @MaxLength(255, { message: 'Category name must not exceed 255 characters.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a valid string.' })
  description?: string;
}
