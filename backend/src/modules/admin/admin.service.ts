import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, UserRole } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { Service } from '../services/entities/service.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Review } from '../reviews/entities/review.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getDashboardStats(): Promise<any> {
    const [
      totalUsers,
      totalProviders,
      totalClients,
      totalOrders,
      totalServices,
      totalPayments,
      totalReviews,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.PROVIDER } }),
      this.userRepository.count({ where: { role: UserRole.CLIENT } }),
      this.orderRepository.count(),
      this.serviceRepository.count(),
      this.paymentRepository.count(),
      this.reviewRepository.count(),
    ]);

    // Revenue stats
    const revenueStats = await this.paymentRepository
      .createQueryBuilder('payment')
      .select([
        'SUM(payment.amount) as totalRevenue',
        'SUM(payment.platformFee) as totalFees',
        'COUNT(payment.id) as totalTransactions',
      ])
      .where('payment.status = :status', { status: 'paid' })
      .getRawOne();

    // Recent activity
    const recentOrders = await this.orderRepository.find({
      relations: ['client', 'provider', 'service'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const recentUsers = await this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      stats: {
        totalUsers,
        totalProviders,
        totalClients,
        totalOrders,
        totalServices,
        totalPayments,
        totalReviews,
        totalRevenue: parseFloat(revenueStats.totalRevenue) || 0,
        totalFees: parseFloat(revenueStats.totalFees) || 0,
        totalTransactions: parseInt(revenueStats.totalTransactions) || 0,
      },
      recentActivity: {
        orders: recentOrders,
        users: recentUsers,
      },
    };
  }

  async getUsers(page: number = 1, limit: number = 20, status?: UserStatus, role?: string): Promise<any> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.role',
        'user.status',
        'user.rating',
        'user.totalReviews',
        'user.createdAt',
        'user.lastActiveAt',
      ]);

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    await this.userRepository.update(userId, { status });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getOrders(page: number = 1, limit: number = 20, status?: string): Promise<any> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.provider', 'provider')
      .leftJoinAndSelect('order.service', 'service');

    if (status) {
      queryBuilder.where('order.status = :status', { status });
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getServices(page: number = 1, limit: number = 20, status?: string): Promise<any> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider');

    if (status) {
      queryBuilder.where('service.status = :status', { status });
    }

    const [services, total] = await queryBuilder
      .orderBy('service.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPayments(page: number = 1, limit: number = 20, status?: string): Promise<any> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.payer', 'payer')
      .leftJoinAndSelect('payment.receiver', 'receiver')
      .leftJoinAndSelect('payment.order', 'order');

    if (status) {
      queryBuilder.where('payment.status = :status', { status });
    }

    const [payments, total] = await queryBuilder
      .orderBy('payment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReviews(page: number = 1, limit: number = 20): Promise<any> {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      relations: ['reviewer', 'reviewee', 'order'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}