import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Limpeza residencial completa' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Serviço completo de limpeza para sua casa, incluindo todos os cômodos' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Limpeza' })
  @IsString()
  category: string;

  @ApiProperty({ example: ['Limpeza doméstica', 'Faxina pesada'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subcategories?: string[];

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  basePrice: number;

  @ApiProperty({ example: 'BRL', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 180, description: 'Duration in minutes', required: false })
  @IsOptional()
  @IsNumber()
  estimatedDuration?: number;

  @ApiProperty({ 
    example: { start: '08:00', end: '18:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    required: false 
  })
  @IsOptional()
  @IsObject()
  availableHours?: {
    start: string;
    end: string;
    days: string[];
  };

  @ApiProperty({ 
    example: { radius: 10, cities: ['São Paulo', 'Guarulhos'] },
    required: false 
  })
  @IsOptional()
  @IsObject()
  serviceArea?: {
    radius: number;
    cities: string[];
  };

  @ApiProperty({ example: ['Produtos de limpeza próprios', 'Equipamentos profissionais'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}