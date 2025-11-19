import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { MediaType } from "../entities/media.entity";

export class CreateMediaDto {
    @IsNotEmpty()
    url: string;

    @IsNotEmpty()
    @IsEnum(MediaType)
    type: MediaType;

}
