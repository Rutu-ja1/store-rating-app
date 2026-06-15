// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(20, { message: 'Name must be at least 20 characters' })
    @MaxLength(60, { message: 'Name must be at most 60 characters' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MaxLength(400, { message: 'Address must be at most 400 characters' })
    address: string;

    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{8,16}$/, {
        message: 'Password: 8-16 chars, at least 1 uppercase and 1 special character',
    })
    password: string;

    @IsOptional()       // ✅ makes role optional
    @IsString()
    role?: string;
}