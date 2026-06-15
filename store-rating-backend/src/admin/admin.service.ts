// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/ratings.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Store) private storeRepo: Repository<Store>,
        @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    ) { }

    async getDashboardStats() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            this.userRepo.count(),
            this.storeRepo.count(),
            this.ratingRepo.count(),
        ]);
        return { totalUsers, totalStores, totalRatings };
    }
}