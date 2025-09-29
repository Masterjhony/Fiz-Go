import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  create(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get('my-reviews')
  @ApiOperation({ summary: 'Get current user reviews' })
  @ApiQuery({ name: 'type', enum: ['given', 'received'], required: false })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  findMyReviews(@Req() req, @Query('type') type: 'given' | 'received' = 'given') {
    return this.reviewsService.findByUser(req.user.id, type);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews for a specific user' })
  @ApiQuery({ name: 'type', enum: ['given', 'received'], required: false })
  @ApiResponse({ status: 200, description: 'User reviews retrieved successfully' })
  findUserReviews(@Param('userId') userId: string, @Query('type') type: 'given' | 'received' = 'received') {
    return this.reviewsService.findByUser(userId, type);
  }

  @Get('user/:userId/rating')
  @ApiOperation({ summary: 'Get average rating for a user' })
  @ApiResponse({ status: 200, description: 'User rating retrieved successfully' })
  getUserRating(@Param('userId') userId: string) {
    return this.reviewsService.getAverageRating(userId);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get reviews for a specific order' })
  @ApiResponse({ status: 200, description: 'Order reviews retrieved successfully' })
  findOrderReviews(@Param('orderId') orderId: string) {
    return this.reviewsService.findByOrder(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }
}