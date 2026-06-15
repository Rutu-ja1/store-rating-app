// src/users/dto/update-password.dto.ts
import { IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{8,16}$/, {
        message: 'Password: 8-16 chars, at least 1 uppercase and 1 special character',
    })
    newPassword: string;
}