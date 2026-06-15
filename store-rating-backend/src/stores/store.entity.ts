import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, JoinColumn,
    CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 60 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ length: 400 })
    address: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column({ nullable: true })
    owner_id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}