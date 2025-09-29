import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@ApiTags('payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    return this.paymentsService.create(createPaymentDto, req.user.id);
  }

  @Get('my-payments')
  @ApiOperation({ summary: 'Get current user payments' })
  @ApiQuery({ name: 'type', enum: ['payer', 'receiver'], required: false })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  findMyPayments(@Req() req, @Query('type') type: 'payer' | 'receiver' = 'payer') {
    return this.paymentsService.findByUser(req.user.id, type);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payment statistics for current user' })
  @ApiResponse({ status: 200, description: 'Payment stats retrieved successfully' })
  getPaymentStats(@Req() req) {
    return this.paymentsService.getPaymentStats(req.user.id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments for a specific order' })
  @ApiResponse({ status: 200, description: 'Order payments retrieved successfully' })
  findOrderPayments(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm payment (webhook/manual)' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  confirmPayment(@Param('id') id: string) {
    return this.paymentsService.confirmPayment(id);
  }

  @Patch(':id/release')
  @ApiOperation({ summary: 'Release payment to provider' })
  @ApiResponse({ status: 200, description: 'Payment released successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  releasePayment(@Param('id') id: string) {
    return this.paymentsService.releasePayment(id);
  }

  @Patch(':id/refund')
  @ApiOperation({ summary: 'Refund payment' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  refundPayment(@Param('id') id: string, @Body() refundPaymentDto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(id, refundPaymentDto.reason);
  }
}