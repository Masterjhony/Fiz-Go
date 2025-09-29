import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.ACCEPTED })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ example: 'Cliente não estava disponível no horário agendado', required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}