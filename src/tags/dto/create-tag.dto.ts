import { IsNotEmpty, Length } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Tag name is required' })
  @Length(2, 30, { message: 'Tag name must be between 2 and 30 characters' })
  name: string;
}
