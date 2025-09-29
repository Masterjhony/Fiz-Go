import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({ status: 201, description: 'Chat created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  create(@Body() createChatDto: CreateChatDto, @Req() req) {
    return this.chatService.createChat(createChatDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user chats' })
  @ApiResponse({ status: 200, description: 'Chats retrieved successfully' })
  findMyChats(@Req() req) {
    return this.chatService.findUserChats(req.user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread messages count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  getUnreadCount(@Req() req) {
    return this.chatService.getUnreadCount(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiResponse({ status: 200, description: 'Chat retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.chatService.findOne(id, req.user.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get chat messages' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  getChatMessages(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Req() req,
  ) {
    return this.chatService.getChatMessages(id, req.user.id, page, limit);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in chat' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  sendMessage(@Param('id') id: string, @Body() sendMessageDto: SendMessageDto, @Req() req) {
    return this.chatService.sendMessage(id, sendMessageDto, req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark chat messages as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.chatService.markMessagesAsRead(id, req.user.id);
  }
}