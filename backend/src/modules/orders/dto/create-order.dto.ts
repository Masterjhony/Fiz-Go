import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-of-service' })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: 'Preciso de uma limpeza completa da casa', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 150.00, required: false })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @ApiProperty({ example: -23.5505, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -46.6333, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 'Rua das Flores, 123, Apt 45', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'Brasil', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '01234-567', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ example: 'Apartamento no 5º andar, interfone 45', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}