import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // THE FIX: Explicitly use 'better-sqlite3' to match your driver package
      type: 'better-sqlite3', 
      database: 'en2h_booking.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    UsersModule,
    ServicesModule,
    BookingsModule,
    AuthModule,
  ],
})
export class AppModule {}