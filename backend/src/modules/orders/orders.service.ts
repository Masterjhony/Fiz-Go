import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private servicesService: ServicesService,
  ) {}

  async create(createOrderDto: CreateOrderDto, clientId: string): Promise<Order> {
    const service = await this.servicesService.findOne(createOrderDto.serviceId);
    
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Generate order number
    const orderNumber = `FIZ${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = this.orderRepository.create({
      ...createOrderDto,
      orderNumber,
      clientId,
      providerId: service.providerId,
      totalAmount: createOrderDto.totalAmount || service.basePrice,
      platformFee: (createOrderDto.totalAmount || service.basePrice) * 0.1, // 10% platform fee
      providerAmount: (createOrderDto.totalAmount || service.basePrice) * 0.9,
    });

    return this.orderRepository.save(order);
  }

  async findAll(userId: string, role: string): Promise<Order[]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.service', 'service')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.provider', 'provider');

    if (role === 'client') {
      queryBuilder.where('order.clientId = :userId', { userId });
    } else if (role === 'provider') {
      queryBuilder.where('order.providerId = :userId', { userId });
    }

    return queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['service', 'client', 'provider', 'reviews'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, userId: string): Promise<Order> {
    const order = await this.findOne(id);
    
    // Verify user permission
    if (order.clientId !== userId && order.providerId !== userId) {
      throw new BadRequestException('You can only update your own orders');
    }

    const { status, cancellationReason } = updateOrderStatusDto;

    // Validate status transitions
    if (status === OrderStatus.ACCEPTED && order.providerId !== userId) {
      throw new BadRequestException('Only provider can accept order');
    }

    if (status === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();
      if (cancellationReason) {
        order.cancellationReason = cancellationReason;
      }
    }

    if (status === OrderStatus.IN_PROGRESS) {
      order.startedAt = new Date();
    }

    if (status === OrderStatus.COMPLETED) {
      order.completedAt = new Date();
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  async findByStatus(status: OrderStatus, userId?: string): Promise<Order[]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.service', 'service')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.provider', 'provider')
      .where('order.status = :status', { status });

    if (userId) {
      queryBuilder.andWhere('(order.clientId = :userId OR order.providerId = :userId)', { userId });
    }

    return queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }
}