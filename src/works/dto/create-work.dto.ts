import {
  IsNotEmpty,
  IsPositive,
  Length,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
} from 'class-validator';

export class CreateWorkDto {
  @IsNotEmpty({ message: 'Title is required' })
  @Length(3, 50, { message: 'Title must be between 3 and 50 characters' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be greater than 0' })
  price: number;

  @IsOptional()
  @IsArray({ message: 'Categories must be an array of IDs' })
  @ArrayNotEmpty({ message: 'Categories array cannot be empty if provided' })
  @ArrayUnique({ message: 'Category IDs must be unique' })
  @IsInt({ each: true, message: 'Each category ID must be an integer' })
  categories?: number[];

  @IsOptional()
  @IsArray({ message: 'Tags must be an array of IDs' })
  @ArrayNotEmpty({ message: 'Tags array cannot be empty if provided' })
  @ArrayUnique({ message: 'Tag IDs must be unique' })
  @IsInt({ each: true, message: 'Each tag ID must be an integer' })
  tags?: number[];
}
