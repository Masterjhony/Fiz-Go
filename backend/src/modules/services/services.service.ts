import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, providerId: string): Promise<Service> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      providerId,
    });

    return this.serviceRepository.save(service);
  }

  async findAll(category?: string, latitude?: number, longitude?: number, radius = 10): Promise<Service[]> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .where('service.status = :status', { status: 'active' })
      .andWhere('provider.status = :providerStatus', { providerStatus: 'active' })
      .andWhere('provider.isAvailable = :isAvailable', { isAvailable: true });

    if (category) {
      queryBuilder.andWhere('service.category = :category', { category });
    }

    if (latitude && longitude) {
      queryBuilder
        .addSelect(`
          (6371 * acos(
            cos(radians(:latitude)) * cos(radians(provider.latitude)) *
            cos(radians(provider.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(provider.latitude))
          ))
        `, 'distance')
        .having('distance <= :radius')
        .orderBy('distance', 'ASC')
        .setParameters({ latitude, longitude, radius });
    } else {
      queryBuilder.orderBy('service.rating', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['provider'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId: string): Promise<Service> {
    const service = await this.findOne(id);

    if (service.providerId !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }

    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string, userId: string): Promise<void> {
    const service = await this.findOne(id);

    if (service.providerId !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.serviceRepository.remove(service);
  }

  async findByProvider(providerId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { providerId },
      order: { createdAt: 'DESC' },
    });
  }
}