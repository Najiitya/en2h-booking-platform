import { IsString, IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsDateString() // Validates the date format (YYYY-MM-DD)
  bookingDate: string;

  @IsString()
  @IsNotEmpty()
  bookingTime: string;
}