import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Status_enum } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  workId: number; 

  @IsNotEmpty()
  @IsNumber()
  total_price: number; 

  @IsOptional()
  payment_info?: any; 

  @IsOptional()
  @IsEnum(Status_enum)
  status?: Status_enum; 
}
