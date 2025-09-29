import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.givenReviews)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  @Column('uuid')
  reviewerId: string;

  @ManyToOne(() => User, (user) => user.receivedReviews)
  @JoinColumn({ name: 'revieweeId' })
  reviewee: User;

  @Column('uuid')
  revieweeId: string;

  @ManyToOne(() => Order, (order) => order.reviews)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('uuid')
  orderId: string;
}