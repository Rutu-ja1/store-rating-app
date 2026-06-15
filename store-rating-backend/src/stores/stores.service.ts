// src/stores/stores.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { Rating } from '../ratings/ratings.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store) private storeRepo: Repository<Store>,
        @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    ) { }

    async create(dto: CreateStoreDto): Promise<Store> {
        const store = this.storeRepo.create(dto);
        return this.storeRepo.save(store);
    }
    // src/stores/stores.service.ts
    async remove(id: string): Promise<{ message: string }> {
        const store = await this.storeRepo.findOne({ where: { id } });
        if (!store) throw new NotFoundException('Store not found');
        await this.storeRepo.remove(store);
        return { message: 'Store deleted successfully' };
    }

    async findAll(
        userId: string,
        filters: { name?: string; address?: string },
        sortBy = 'name',
        sortOrder: 'ASC' | 'DESC' = 'ASC',
    ) {
        const stores = await this.storeRepo.createQueryBuilder('s')
            .leftJoinAndSelect('s.owner', 'owner')
            .orderBy(`s.${sortBy}`, sortOrder)
            .getMany();

        const result = await Promise.all(stores.map(async (store) => {
            const avgResult = await this.ratingRepo
                .createQueryBuilder('r')
                .select('AVG(r.rating)', 'average')
                .addSelect('COUNT(*)', 'count')
                .where('r.store_id = :storeId', { storeId: store.id })
                .getRawOne();

            // ✅ Fix 1: typed as number | null explicitly
            let myRating: number | null = null;
            if (userId) {
                const userRating = await this.ratingRepo.findOne({
                    where: { store: { id: store.id }, user: { id: userId } },
                });
                myRating = userRating ? userRating.rating : null;
            }

            return {
                ...store,
                averageRating: parseFloat(avgResult.average) || 0,
                totalRatings: parseInt(avgResult.count) || 0,
                myRating,
            };
        }));

        return result.filter(s => {
            if (filters.name && !s.name.toLowerCase()
                .includes(filters.name.toLowerCase())) return false;
            if (filters.address && !s.address.toLowerCase()
                .includes(filters.address.toLowerCase())) return false;
            return true;
        });
    }

    async findOne(id: string) {
        const store = await this.storeRepo.findOne({
            where: { id },
            // ✅ Fix 2: use object syntax instead of array for relations
            relations: { owner: true },
        });
        if (!store) throw new NotFoundException('Store not found');
        return store;
    }
}