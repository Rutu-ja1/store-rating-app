// src/ratings/ratings.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './ratings.entity';

@Injectable()
export class RatingsService {
    constructor(
        @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    ) { }

    async submitOrUpdate(userId: string, storeId: string, value: number) {
        if (value < 1 || value > 5)
            throw new BadRequestException('Rating must be between 1 and 5');

        const existing = await this.ratingRepo.findOne({
            where: { user: { id: userId }, store: { id: storeId } },
        });

        if (existing) {
            existing.rating = value;
            await this.ratingRepo.save(existing);
        } else {
            const rating = this.ratingRepo.create({
                user: { id: userId },
                store: { id: storeId },
                rating: value,
            });
            await this.ratingRepo.save(rating);
        }

        return { message: 'Rating saved successfully', rating: value };
    }

    async getStoreRaters(storeId: string) {
        return this.ratingRepo.find({
            where: { store: { id: storeId } },
            // ✅ Fix: object syntax instead of array
            relations: { user: true },
            select: {
                id: true,
                rating: true,
                createdAt: true,
                user: { id: true, name: true, email: true },
            },
        });
    }

    async getAverageRating(storeId: string) {
        const result = await this.ratingRepo
            .createQueryBuilder('r')
            .select('AVG(r.rating)', 'average')
            .addSelect('COUNT(*)', 'count')
            .where('r.store_id = :storeId', { storeId })
            .getRawOne();
        return {
            average: parseFloat(result.average) || 0,
            count: parseInt(result.count) || 0,
        };
    }
}