// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/ratings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store, Rating])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule { }