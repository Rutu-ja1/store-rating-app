// src/users/users.controller.ts
import {
    Controller, Post, Get, Patch, Body,
    Param, Query, UseGuards, Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    // public signup — normal users only
    @Post('signup')
    signup(@Body() dto: CreateUserDto) {
        return this.usersService.signup(dto);
    }

    // admin creates any role
    @Post('admin/create')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    createByAdmin(@Body() dto: CreateUserDto) {
        return this.usersService.createByAdmin(dto);
    }

    // get all users with filters — admin only
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findAll(
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('address') address?: string,
        @Query('role') role?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    ) {
        return this.usersService.findAll(
            { name, email, address, role },
            sortBy || 'name',
            sortOrder || 'ASC',
        );
    }

    // get single user — admin only
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    // update password — all logged in users
    @Patch('update-password')
    @UseGuards(JwtAuthGuard)
    updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
        return this.usersService.updatePassword(req.user.id, dto);
    }
}