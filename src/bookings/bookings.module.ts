import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
// 1. Import the Service entity
import { Service } from '../services/entities/service.entity';
import { ServicesModule } from '../services/services.module';

@Module({
  // 2. Add Service right next to Booking so this module can read both tables
  imports: [TypeOrmModule.forFeature([Booking]), ServicesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}