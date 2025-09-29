import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private ordersService: OrdersService,
    private usersService: UsersService,
  ) {}

  async create(createReviewDto: CreateReviewDto, reviewerId: string): Promise<Review> {
    const { orderId, revieweeId, rating, comment, images } = createReviewDto;

    // Verify order exists and is completed
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed orders');
    }

    // Verify reviewer is part of the order
    if (order.clientId !== reviewerId && order.providerId !== reviewerId) {
      throw new BadRequestException('You can only review orders you participated in');
    }

    // Verify reviewee is the other party in the order
    const expectedRevieweeId = order.clientId === reviewerId ? order.providerId : order.clientId;
    if (revieweeId !== expectedRevieweeId) {
      throw new BadRequestException('Invalid reviewee for this order');
    }

    // Check if review already exists
    const existingReview = await this.reviewRepository.findOne({
      where: { orderId, reviewerId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this order');
    }

    // Create review
    const review = this.reviewRepository.create({
      orderId,
      reviewerId,
      revieweeId,
      rating,
      comment: comment || null,
      images: images || null,
      isPublic: true,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update reviewee's rating
    await this.updateUserRating(revieweeId);

    return savedReview;
  }

  async findByUser(userId: string, type: 'given' | 'received'): Promise<Review[]> {
    const whereCondition = type === 'given' ? { reviewerId: userId } : { revieweeId: userId };
    
    return this.reviewRepository.find({
      where: whereCondition,
      relations: ['reviewer', 'reviewee', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrder(orderId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { orderId },
      relations: ['reviewer', 'reviewee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['reviewer', 'reviewee', 'order'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  private async updateUserRating(userId: string): Promise<void> {
    // Calculate average rating for user
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.revieweeId = :userId', { userId })
      .getRawOne();

    const avgRating = parseFloat(result.avgRating) || 0;
    const totalReviews = parseInt(result.totalReviews) || 0;

    // Update user's rating
    await this.usersService.update(userId, {
      rating: Math.round(avgRating * 100) / 100, // Round to 2 decimal places
      totalReviews,
    });
  }

  async getAverageRating(userId: string): Promise<{ rating: number; totalReviews: number }> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.revieweeId = :userId', { userId })
      .andWhere('review.isPublic = :isPublic', { isPublic: true })
      .getRawOne();

    return {
      rating: Math.round((parseFloat(result.avgRating) || 0) * 100) / 100,
      totalReviews: parseInt(result.totalReviews) || 0,
    };
  }
}