import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message, MessageType } from './entities/message.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private ordersService: OrdersService,
  ) {}

  async createChat(createChatDto: CreateChatDto, userId: string): Promise<Chat> {
    const { orderId, providerId, clientId } = createChatDto;

    // Verify order exists if provided
    if (orderId) {
      const order = await this.ordersService.findOne(orderId);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      
      // Auto-set participants from order
      createChatDto.clientId = order.clientId;
      createChatDto.providerId = order.providerId;
    }

    // Verify user is part of the chat
    if (userId !== clientId && userId !== providerId) {
      throw new ForbiddenException('You can only create chats you participate in');
    }

    // Check if chat already exists for this order or participants
    let existingChat;
    if (orderId) {
      existingChat = await this.chatRepository.findOne({ where: { orderId } });
    } else {
      existingChat = await this.chatRepository.findOne({
        where: [
          { clientId, providerId },
          { clientId: providerId, providerId: clientId },
        ],
      });
    }

    if (existingChat) {
      return existingChat;
    }

    const chat = this.chatRepository.create({
      ...createChatDto,
      title: createChatDto.title || `Chat - Order ${orderId || 'Direct'}`,
    });

    return this.chatRepository.save(chat);
  }

  async findUserChats(userId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: [
        { clientId: userId },
        { providerId: userId },
      ],
      relations: ['client', 'provider', 'order'],
      order: { lastMessageAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['client', 'provider', 'order', 'messages'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Verify user is part of the chat
    if (chat.clientId !== userId && chat.providerId !== userId) {
      throw new ForbiddenException('You can only access chats you participate in');
    }

    return chat;
  }

  async sendMessage(chatId: string, sendMessageDto: SendMessageDto, senderId: string): Promise<Message> {
    const chat = await this.findOne(chatId, senderId);

    const message = this.messageRepository.create({
      ...sendMessageDto,
      chatId,
      senderId,
      type: sendMessageDto.type || MessageType.TEXT,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Update chat's last message timestamp
    chat.lastMessageAt = new Date();
    await this.chatRepository.save(chat);

    // Load the message with sender relation
    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });
  }

  async getChatMessages(chatId: string, userId: string, page = 1, limit = 50): Promise<Message[]> {
    // Verify user has access to chat
    await this.findOne(chatId, userId);

    return this.messageRepository.find({
      where: { chatId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await this.findOne(chatId, userId);

    await this.messageRepository.update(
      {
        chatId,
        senderId: userId !== userId ? userId : undefined, // Mark messages from other user
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.chat', 'chat')
      .where('(chat.clientId = :userId OR chat.providerId = :userId)', { userId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.isRead = :isRead', { isRead: false })
      .getCount();

    return result;
  }
}