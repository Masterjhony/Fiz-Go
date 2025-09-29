import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column({ type: 'json', nullable: true })
  subcategories: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ default: 'BRL' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @Column({ default: 0 })
  estimatedDuration: number; // in minutes

  @Column({ type: 'json', nullable: true })
  availableHours: {
    start: string;
    end: string;
    days: string[];
  };

  @Column({ type: 'json', nullable: true })
  serviceArea: {
    radius: number; // in kilometers
    cities: string[];
  };

  @Column({ type: 'json', nullable: true })
  requirements: string[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalOrders: number;

  @Column({ default: 0 })
  totalReviews: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'providerId' })
  provider: User;

  @Column('uuid')
  providerId: string;

  @OneToMany(() => Order, (order) => order.service)
  orders: Order[];
}