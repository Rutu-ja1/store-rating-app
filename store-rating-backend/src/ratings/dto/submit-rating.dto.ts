// src/ratings/dto/submit-rating.dto.ts
import { IsInt, IsString, Min, Max } from 'class-validator';

export class SubmitRatingDto {
    @IsString()
    storeId: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}