import { IsNotEmpty, IsString, IsInt, Min, Max } from "class-validator";

export class CreateCommentDto {  
    
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(10)
    rating: number;
}
