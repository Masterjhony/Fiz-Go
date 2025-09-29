import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: 'uuid-of-client', required: false })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({ example: 'uuid-of-provider', required: false })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiProperty({ example: 'uuid-of-order', required: false })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ example: 'Chat sobre limpeza residencial', required: false })
  @IsOptional()
  @IsString()
  title?: string;
}