import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'avatar', 'rating', 'totalReviews', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'status', 'avatar', 'latitude', 'longitude', 'address', 'city', 'state', 'country', 'bio', 'skills', 'rating', 'totalReviews', 'isAvailable', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findProviders(latitude?: number, longitude?: number, radius = 10): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: 'provider' })
      .andWhere('user.status = :status', { status: 'active' })
      .andWhere('user.isAvailable = :isAvailable', { isAvailable: true })
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.avatar', 'user.rating', 'user.totalReviews', 'user.latitude', 'user.longitude', 'user.skills']);

    if (latitude && longitude) {
      // Calculate distance using Haversine formula
      queryBuilder
        .addSelect(`
          (6371 * acos(
            cos(radians(:latitude)) * cos(radians(user.latitude)) *
            cos(radians(user.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(user.latitude))
          ))
        `, 'distance')
        .having('distance <= :radius')
        .orderBy('distance', 'ASC')
        .setParameters({ latitude, longitude, radius });
    }

    return queryBuilder.getMany();
  }

  async updateLocation(userId: string, latitude: number, longitude: number, address?: string): Promise<User> {
    const user = await this.findOne(userId);
    
    user.latitude = latitude;
    user.longitude = longitude;
    if (address) user.address = address;
    
    await this.userRepository.save(user);
    return user;
  }

  async updateAvailability(userId: string, isAvailable: boolean): Promise<User> {
    const user = await this.findOne(userId);
    
    user.isAvailable = isAvailable;
    user.lastActiveAt = new Date();
    
    await this.userRepository.save(user);
    return user;
  }
}