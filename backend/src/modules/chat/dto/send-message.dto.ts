import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class SendMessageDto {
  @ApiProperty({ example: 'Olá! Gostaria de agendar o serviço para amanhã.' })
  @IsString()
  content: string;

  @ApiProperty({ enum: MessageType, example: MessageType.TEXT, required: false })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiProperty({ 
    example: { fileName: 'image.jpg', fileUrl: 'https://example.com/image.jpg' },
    required: false 
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}