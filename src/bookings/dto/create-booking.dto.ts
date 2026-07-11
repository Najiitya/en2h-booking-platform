import { BookingStatus } from '../enums/booking-status.enum';

export class CreateBookingDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string; // Expected format: YYYY-MM-DD
  bookingTime: string; // Expected format: HH:MM
  notes?: string;
}