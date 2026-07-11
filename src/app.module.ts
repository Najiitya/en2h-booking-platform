import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 1. Import your feature modules here
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'en2h_booking.sqlite',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    // 2. Add them to this array so NestJS activates their controllers
    UsersModule,    
    ServicesModule, 
    BookingsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}