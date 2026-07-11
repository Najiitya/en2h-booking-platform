import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>, // Needed to verify the service exists
  ) {}

  // 1. Create Booking
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Business Rule: A booking must belong to an existing service[cite: 1]
    const service = await this.serviceRepository.findOne({ where: { id: createBookingDto.serviceId } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${createBookingDto.serviceId} does not exist.`);
    }

    // Business Rule: Booking dates cannot be in the past[cite: 1]
    const bookingDate = new Date(createBookingDto.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day comparison
    if (bookingDate < today) {
      throw new BadRequestException('Booking dates cannot be in the past.');
    }

    // Bonus Feature: Prevent duplicate bookings for the same service, date, and time[cite: 1]
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        serviceId: createBookingDto.serviceId,
        bookingDate: createBookingDto.bookingDate as any,
        bookingTime: createBookingDto.bookingTime,
        status: BookingStatus.CONFIRMED // Only check against active bookings
      },
    });

    if (existingBooking) {
      throw new BadRequestException('This time slot is already booked for the selected service.');
    }

    const booking = this.bookingRepository.create(createBookingDto);
    return await this.bookingRepository.save(booking);
  }

  // 2. Get All Bookings
  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({ relations: { service: true } });
  }

  // 3. Get Booking by ID
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ 
      where: { id },
      relations: { service: true } // Returns the associated service data
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }
    return booking;
  }

  // 4. Update Booking Status
  async updateStatus(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    // Business Rule: Cancelled bookings cannot be marked as completed[cite: 1]
    if (booking.status === BookingStatus.CANCELLED && updateBookingDto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('A cancelled booking cannot be marked as completed.');
    }

    booking.status = updateBookingDto.status;
    return await this.bookingRepository.save(booking);
  }

  // 5. Cancel Booking (Helper method to align with requirements)
  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    return await this.bookingRepository.save(booking);
  }
}