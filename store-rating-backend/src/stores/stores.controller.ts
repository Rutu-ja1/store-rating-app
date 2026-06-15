// src/stores/stores.controller.ts
import {
    Controller, Get, Post, Delete, Body,
    Param, Query, UseGuards, Request
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
    constructor(private storesService: StoresService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    create(@Body() dto: CreateStoreDto) {
        return this.storesService.create(dto);
    }

    @Get()
    findAll(
        @Request() req,
        @Query('name') name?: string,
        @Query('address') address?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    ) {
        return this.storesService.findAll(
            req.user.id,
            { name, address },
            sortBy || 'name',
            sortOrder || 'ASC',
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.storesService.findOne(id);
    }

    // ✅ delete store — admin only
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.storesService.remove(id);
    }
}