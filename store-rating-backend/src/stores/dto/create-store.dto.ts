// src/stores/dto/create-store.dto.ts
import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateStoreDto {
    @IsString()
    @MinLength(20, { message: 'Name must be at least 20 characters' })
    @MaxLength(60, { message: 'Name must be at most 60 characters' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MaxLength(400, { message: 'Address must be at most 400 characters' })
    address: string;

    @IsOptional()        // ✅ makes owner_id optional
    @IsString()
    owner_id?: string;
}