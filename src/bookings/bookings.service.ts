import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private servicesService: ServicesService, // Inject the Services logic
  ) {}

  async create(createBookingDto: any): Promise<Booking> {
    // RULE 1: Booking dates cannot be in the past
    const bookingDate = new Date(createBookingDto.appointmentDate);
    if (bookingDate < new Date()) {
      throw new BadRequestException('Booking dates cannot be in the past');
    }

    // RULE 2: A booking must belong to an existing service
    // This will automatically throw a NotFoundException if the service ID doesn't exist
    await this.servicesService.findOne(createBookingDto.serviceId); 

    const newBooking = this.bookingsRepository.create(createBookingDto as Partial<Booking>);
    return await this.bookingsRepository.save(newBooking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingsRepository.find();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: string, updateBookingDto: any): Promise<Booking> {
    const booking = await this.findOne(id);

    // RULE 3: Cancelled bookings cannot be marked as completed
    if (booking.status === 'cancelled' && updateBookingDto.status === 'completed') {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    Object.assign(booking, updateBookingDto);
    return await this.bookingsRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }
}