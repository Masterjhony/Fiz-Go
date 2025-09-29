import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Socket>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove user from userSockets map
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket.id === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    this.userSockets.set(data.userId, client);
    client.join(`user:${data.userId}`);
    console.log(`User ${data.userId} joined`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(@MessageBody() data: { chatId: string }, @ConnectedSocket() client: Socket) {
    client.join(`chat:${data.chatId}`);
    console.log(`Client joined chat: ${data.chatId}`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(@MessageBody() data: { chatId: string }, @ConnectedSocket() client: Socket) {
    client.leave(`chat:${data.chatId}`);
    console.log(`Client left chat: ${data.chatId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { chatId: string; message: SendMessageDto; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.sendMessage(data.chatId, data.message, data.userId);
      
      // Emit message to all clients in the chat room
      this.server.to(`chat:${data.chatId}`).emit('newMessage', {
        chatId: data.chatId,
        message,
      });

      // Emit notification to the recipient if they're online but not in the chat room
      const chat = await this.chatService.findOne(data.chatId, data.userId);
      const recipientId = chat.clientId === data.userId ? chat.providerId : chat.clientId;
      
      this.server.to(`user:${recipientId}`).emit('messageNotification', {
        chatId: data.chatId,
        message,
        unreadCount: await this.chatService.getUnreadCount(recipientId),
      });

    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { chatId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.chatService.markMessagesAsRead(data.chatId, data.userId);
      
      // Notify other participants that messages were read
      this.server.to(`chat:${data.chatId}`).emit('messagesRead', {
        chatId: data.chatId,
        userId: data.userId,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { chatId: string; userId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast typing status to other participants in the chat
    client.to(`chat:${data.chatId}`).emit('userTyping', {
      chatId: data.chatId,
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }

  // Method to send notifications from other parts of the application
  async sendNotification(userId: string, notification: any) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit('notification', notification);
    }
  }
}