import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty({ example: 'Serviço não foi realizado conforme acordado' })
  @IsString()
  reason: string;
}