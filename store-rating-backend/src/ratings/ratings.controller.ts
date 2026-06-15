// src/ratings/ratings.controller.ts
import {
    Controller, Post, Get, Body,
    Param, UseGuards, Request
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
    constructor(private ratingsService: RatingsService) { }

    // normal user submits or updates rating
    @Post()
    @UseGuards(RolesGuard)
    @Roles('normal_user')
    submitRating(@Request() req, @Body() dto: SubmitRatingDto) {
        return this.ratingsService.submitOrUpdate(
            req.user.id,
            dto.storeId,
            dto.rating,
        );
    }

    // store owner sees who rated their store
    @Get('store/:storeId/raters')
    @UseGuards(RolesGuard)
    @Roles('store_owner', 'admin')
    getStoreRaters(@Param('storeId') storeId: string) {
        return this.ratingsService.getStoreRaters(storeId);
    }

    // get average rating for a store
    @Get('store/:storeId/average')
    getAverageRating(@Param('storeId') storeId: string) {
        return this.ratingsService.getAverageRating(storeId);
    }
}