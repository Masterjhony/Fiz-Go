import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private ordersService: OrdersService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, payerId: string): Promise<Payment> {
    const { orderId, method } = createPaymentDto;

    // Verify order exists and is accepted
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.ACCEPTED) {
      throw new BadRequestException('Order must be accepted before payment');
    }

    if (order.clientId !== payerId) {
      throw new BadRequestException('Only the client can make payment for this order');
    }

    // Check if payment already exists for this order
    const existingPayment = await this.paymentRepository.findOne({
      where: { orderId },
    });

    if (existingPayment && existingPayment.status !== PaymentStatus.FAILED) {
      throw new BadRequestException('Payment already exists for this order');
    }

    // Generate transaction ID
    const transactionId = `FIZ-PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const payment = this.paymentRepository.create({
      transactionId,
      method,
      orderId,
      payerId,
      receiverId: order.providerId,
      amount: order.totalAmount,
      platformFee: order.platformFee,
      providerAmount: order.providerAmount,
      currency: order.currency,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Generate PIX code if method is PIX
    if (method === PaymentMethod.PIX) {
      await this.generatePixCode(savedPayment.id);
    }

    return this.findOne(savedPayment.id);
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['payer', 'receiver', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByOrder(orderId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { orderId },
      relations: ['payer', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, type: 'payer' | 'receiver'): Promise<Payment[]> {
    const whereCondition = type === 'payer' ? { payerId: userId } : { receiverId: userId };
    
    return this.paymentRepository.find({
      where: whereCondition,
      relations: ['payer', 'receiver', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async confirmPayment(paymentId: string): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();

    // Update order payment status
    await this.ordersService.updateStatus(payment.orderId, { status: OrderStatus.IN_PROGRESS }, payment.payerId);

    return this.paymentRepository.save(payment);
  }

  async releasePayment(paymentId: string): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Payment must be paid before release');
    }

    if (payment.order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Order must be completed before payment release');
    }

    payment.status = PaymentStatus.RELEASED;
    payment.releasedAt = new Date();

    return this.paymentRepository.save(payment);
  }

  async refundPayment(paymentId: string, reason: string): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Can only refund paid payments');
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.refundedAt = new Date();
    payment.failureReason = reason;

    // Update order to cancelled
    await this.ordersService.updateStatus(payment.orderId, { 
      status: OrderStatus.CANCELLED,
      cancellationReason: `Payment refunded: ${reason}`
    }, payment.payerId);

    return this.paymentRepository.save(payment);
  }

  private async generatePixCode(paymentId: string): Promise<void> {
    const payment = await this.findOne(paymentId);
    
    // In a real implementation, you would integrate with a PIX provider
    // For demo purposes, we'll generate a mock PIX code
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136${payment.transactionId}520400005303986540${payment.amount.toFixed(2)}5802BR5925FIZ-GO PAGAMENTOS LTDA6009SAO PAULO62070503***6304`;
    
    payment.pixCode = pixCode;
    payment.pixKey = 'pix@fizgo.com.br'; // Demo PIX key
    
    await this.paymentRepository.save(payment);
  }

  async getPaymentStats(userId: string): Promise<any> {
    const stats = await this.paymentRepository
      .createQueryBuilder('payment')
      .select([
        'COUNT(payment.id) as totalPayments',
        'SUM(CASE WHEN payment.status = :paid THEN payment.amount ELSE 0 END) as totalPaid',
        'SUM(CASE WHEN payment.status = :released THEN payment.providerAmount ELSE 0 END) as totalEarned',
        'SUM(CASE WHEN payment.status = :pending THEN payment.amount ELSE 0 END) as totalPending',
      ])
      .where('payment.receiverId = :userId OR payment.payerId = :userId', { userId })
      .setParameters({ paid: PaymentStatus.PAID, released: PaymentStatus.RELEASED, pending: PaymentStatus.PENDING })
      .getRawOne();

    return {
      totalPayments: parseInt(stats.totalPayments) || 0,
      totalPaid: parseFloat(stats.totalPaid) || 0,
      totalEarned: parseFloat(stats.totalEarned) || 0,
      totalPending: parseFloat(stats.totalPending) || 0,
    };
  }
}