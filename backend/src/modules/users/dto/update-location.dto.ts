import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: -23.5505 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -46.6333 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: false, example: 'Rua das Flores, 123, São Paulo - SP' })
  @IsOptional()
  @IsString()
  address?: string;
}