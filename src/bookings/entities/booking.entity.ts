import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; 

  @Column()
  serviceId: string; 

  @Column()
  appointmentDate: string; 

  // THE FIX: Explicitly setting the type to 'text' for SQLite compatibility
  @Column({ type: 'text', default: 'pending' }) 
  status: string; 

  @CreateDateColumn()
  createdAt: Date;
}