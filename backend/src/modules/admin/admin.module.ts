import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { ServicesModule } from '../services/services.module';
import { PaymentsModule } from '../payments/payments.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    UsersModule,
    OrdersModule,
    ServicesModule,
    PaymentsModule,
    ReviewsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}