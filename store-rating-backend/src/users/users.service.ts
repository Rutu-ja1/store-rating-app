// src/users/users.service.ts
import {
    Injectable, ConflictException,
    UnauthorizedException, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
    ) { }

    async signup(dto: CreateUserDto): Promise<User> {
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already registered');
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            ...dto,
            password: hashed,
            role: UserRole.NORMAL_USER,
        });
        return this.userRepo.save(user);
    }

    async createByAdmin(dto: CreateUserDto): Promise<User> {
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already registered');
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            ...dto,
            password: hashed,
            role: (dto.role as UserRole) || UserRole.NORMAL_USER,
        });
        return this.userRepo.save(user);
    }

    async updatePassword(userId: string, dto: UpdatePasswordDto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        const valid = await bcrypt.compare(dto.oldPassword, user.password);
        if (!valid) throw new UnauthorizedException('Wrong current password');
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.save(user);
        return { message: 'Password updated successfully' };
    }

    async findAll(filters: {
        name?: string;
        email?: string;
        address?: string;
        role?: string;
    }, sortBy = 'name', sortOrder: 'ASC' | 'DESC' = 'ASC') {
        const q = this.userRepo.createQueryBuilder('u');
        if (filters.name)
            q.andWhere('u.name ILIKE :name', { name: `%${filters.name}%` });
        if (filters.email)
            q.andWhere('u.email ILIKE :email', { email: `%${filters.email}%` });
        if (filters.address)
            q.andWhere('u.address ILIKE :address', { address: `%${filters.address}%` });
        if (filters.role)
            q.andWhere('u.role = :role', { role: filters.role });
        q.orderBy(`u.${sortBy}`, sortOrder);
        q.select(['u.id', 'u.name', 'u.email', 'u.address', 'u.role']);
        return q.getMany();
    }

    async findOne(id: string) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}