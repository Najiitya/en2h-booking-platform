import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])], // Register the entity repository
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [TypeOrmModule], // Export it so other modules (like Bookings) can use it later
})
export class ServicesModule {}